import dotenv from "dotenv";

// IMPORTANT: Load environment variables BEFORE any other imports
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";
import { createRoom, getRoom, updateRoom, deleteRoom } from "./services/store";
import type { Room, Player } from "./types/room";

// --- Security Configuration ---
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const ALLOWED_ORIGINS = allowedOriginsEnv
  ? allowedOriginsEnv.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

console.log("🔒 Allowed Origins:", ALLOWED_ORIGINS);

const MAX_PLAYERS_PER_ROOM = 20; // Limit players per room
const MAX_NAME_LENGTH = 20; // Limit player name length
const MAX_PAYLOAD_SIZE = 10000; // 10KB max for signal payload (prevents file tunneling)

// --- Rate Limiting Configuration ---
// HTTP Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Socket Rate Limiter (Simple Token Bucket per Socket)
const SOCKET_RATE_LIMIT = 10; // Max events per second
const socketRateLimits = new Map<
  string,
  { count: number; lastReset: number }
>();

const isRateLimited = (socketId: string): boolean => {
  const now = Date.now();
  const record = socketRateLimits.get(socketId) || { count: 0, lastReset: now };

  if (now - record.lastReset > 1000) {
    record.count = 0;
    record.lastReset = now;
  }

  record.count++;
  socketRateLimits.set(socketId, record);

  return record.count > SOCKET_RATE_LIMIT;
};

const app = express();

// Apply HTTP Rate Limiter
app.use(apiLimiter);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  allowRequest: (req, callback) => {
    const origin = req.headers.origin;
    // If no origin (e.g. non-browser tools), block it for strict security
    if (!origin) {
      console.log("🚫 Blocked connection with no origin");
      return callback(null, false);
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    console.log(`🚫 Blocked connection from unauthorized origin: ${origin}`);
    callback(null, false);
  },
});

// Serve static files from client build
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Catch-all route to serve index.html for any path (SPA support)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// Offline player ID generation
let offlinePlayerCounter = 0;

const generateOfflinePlayerId = (): string => {
  return `offline_${Date.now()}_${offlinePlayerCounter++}`;
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Clean up rate limit record on disconnect
  socket.on("disconnect", () => {
    socketRateLimits.delete(socket.id);
  });

  // Middleware for all incoming events to check rate limit
  socket.use(([event, ...args], next) => {
    if (isRateLimited(socket.id)) {
      // Optionally emit a warning to the client
      // socket.emit("app_error", { message: "Rate limit exceeded" });
      return; // Drop the event silently to save resources
    }
    next();
  });

  socket.on("create_room", async (data: { playerName: string; avatar: string }) => {
    // Input Sanitization
    const cleanName = (data.playerName || "Player").substring(
      0,
      MAX_NAME_LENGTH
    );

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newPlayer: Player = {
      id: socket.id,
      name: cleanName,
      score: 0,
      avatar: data.avatar,
      isHost: true,
      isOnline: true,
    };

    const room: Room = {
      id: roomId,
      players: [newPlayer],
      hostId: socket.id,
    };

    await createRoom(roomId, room);

    socket.join(roomId);
    socket.emit("room_created", { roomId, player: newPlayer });
    console.log(`Room created: ${roomId} by ${cleanName}`);
  });

  socket.on("check_room", async (data: { roomId: string }) => {
    const room = await getRoom(data.roomId);
    if (room) {
      socket.emit("room_status", { players: room.players });
    } else {
      console.log("🚀 ~ check_room ~ emit app_error");
      socket.emit("app_error", { message: "Room not found" });
      console.log("🚀 ~ check_room ~ emit app_error done");
    }
  });

  socket.on(
    "join_room",
    async (data: { roomId: string; playerName: string; avatar: string }) => {
      const { roomId, playerName, avatar } = data;
      const room = await getRoom(roomId);

      if (room) {
        // Room Capacity Check
        if (room.players.length >= MAX_PLAYERS_PER_ROOM) {
          socket.emit("app_error", { message: "Room is full." });
          return;
        }

        const cleanName = (playerName || "Player").substring(
          0,
          MAX_NAME_LENGTH
        );

        const newPlayer: Player = {
          id: socket.id,
          name: cleanName,
          score: 0,
          avatar,
          isHost: false,
          isOnline: true,
        };

        room.players.push(newPlayer);
        await updateRoom(roomId, room);

        socket.join(roomId);

        // Notify others
        socket.to(roomId).emit("player_joined", newPlayer);

        // Send state
        socket.emit("room_joined", { roomId, players: room.players });
        console.log(`User ${cleanName} joined room ${roomId}`);
      } else {
        socket.emit("app_error", { message: "Room not found" });
      }
    }
  );

  socket.on(
    "add_offline_player",
    async (data: { roomId: string; playerName: string; avatar: string }) => {
      const { roomId, playerName, avatar } = data;
      const room = await getRoom(roomId);

      if (!room) {
        socket.emit("app_error", { message: "Room not found" });
        return;
      }

      // Validation: Seul l'hôte peut ajouter
      const requester = room.players.find((p) => p.id === socket.id);
      if (!requester || !requester.isHost) {
        socket.emit("app_error", {
          message: "Only the host can add offline players",
        });
        return;
      }

      // Validation: Capacité
      if (room.players.length >= MAX_PLAYERS_PER_ROOM) {
        socket.emit("app_error", { message: "Room is full." });
        return;
      }

      // Validation: Noms dupliqués
      const nameExists = room.players.some(
        (p) => p.name.toLowerCase() === playerName.toLowerCase()
      );
      if (nameExists) {
        socket.emit("app_error", {
          message: "A player with this name already exists",
        });
        return;
      }

      const cleanName = (playerName || "Offline Player").substring(
        0,
        MAX_NAME_LENGTH
      );

      const offlinePlayer: Player = {
        id: generateOfflinePlayerId(),
        name: cleanName,
        score: 0,
        avatar,
        isHost: false,
        isOnline: false, // KEY: offline dès la création
      };

      room.players.push(offlinePlayer);
      await updateRoom(roomId, room);

      io.to(roomId).emit("player_joined", offlinePlayer);
      console.log(
        `Offline player ${cleanName} added to room ${roomId} by host`
      );
    }
  );

  socket.on("rejoin_room", async (data: { roomId: string; oldPlayerId: string }) => {
    const { roomId, oldPlayerId } = data;
    const room = await getRoom(roomId);

    if (room) {
      const playerIndex = room.players.findIndex((p) => p.id === oldPlayerId);
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];

        // Empêcher prise de contrôle si déjà online
        if (player.isOnline) {
          socket.emit("app_error", {
            message: "This player is already being controlled by someone else",
          });
          return;
        }

        const previousId = player.id;
        player.id = socket.id; // Update ID to new socket
        player.isOnline = true;

        await updateRoom(roomId, room);

        socket.join(roomId);

        // Notify others that player is back/updated (include oldId for client-side matching)
        socket.to(roomId).emit("player_updated", {
          ...player,
          oldId: previousId,
        });

        // Send full state to rejoinder
        socket.emit("room_joined", { roomId, players: room.players });
        console.log(
          `User ${player.name} rejoined room ${roomId} (old: ${previousId}, new: ${socket.id})`
        );
      } else {
        socket.emit("app_error", { message: "Player profile not found" });
      }
    } else {
      socket.emit("app_error", { message: "Room not found" });
    }
  });

  socket.on(
    "update_score",
    async (data: { roomId: string; playerId: string; newScore: number }) => {
      const { roomId, playerId, newScore } = data;
      const room = await getRoom(roomId);
      if (room) {
        const player = room.players.find((p) => p.id === playerId);
        if (player) {
          player.score = newScore;
          await updateRoom(roomId, room);
          socket.to(roomId).emit("score_updated", { playerId, newScore });
        }
      }
    }
  );

  socket.on(
    "update_player_name",
    async (data: { roomId: string; newName: string; avatar: string }) => {
      const { roomId, newName, avatar } = data;
      const room = await getRoom(roomId);
      if (room) {
        const player = room.players.find((p) => p.id === socket.id);
        if (player) {
          const cleanName = (newName || "Player").substring(0, MAX_NAME_LENGTH);
          player.name = cleanName;
          player.avatar = avatar;
          await updateRoom(roomId, room);
          io.to(roomId).emit("player_name_updated", {
            playerId: socket.id,
            name: cleanName,
            avatar,
          });
        }
      }
    }
  );

  socket.on("reset_game", async (data: { roomId: string }) => {
    const { roomId } = data;
    const room = await getRoom(roomId);
    if (room) {
      room.players.forEach((p) => (p.score = 0));
      await updateRoom(roomId, room);
      io.to(roomId).emit("game_reset");
    }
  });

  socket.on("remove_player", async (data: { roomId: string; playerId: string }) => {
    const { roomId, playerId } = data;
    const room = await getRoom(roomId);
    if (room) {
      // Verify that the requester is the host
      const requester = room.players.find((p) => p.id === socket.id);
      if (!requester || !requester.isHost) {
        socket.emit("app_error", {
          message: "Only the host can remove players",
        });
        return;
      }

      // Find the player to remove
      const playerToRemove = room.players.find((p) => p.id === playerId);
      if (!playerToRemove) {
        socket.emit("app_error", { message: "Player not found" });
        return;
      }

      // Only allow removing offline players
      if (playerToRemove.isOnline) {
        socket.emit("app_error", { message: "Cannot remove online players" });
        return;
      }

      // Remove the player from the room
      room.players = room.players.filter((p) => p.id !== playerId);
      await updateRoom(roomId, room);

      // Notify all clients in the room
      io.to(roomId).emit("player_removed", { playerId });
      console.log(
        `Player ${playerToRemove.name} removed from room ${roomId} by host`
      );
    } else {
      socket.emit("app_error", { message: "Room not found" });
    }
  });

  socket.on("signal", async (data) => {
    // 4. Signal Security: Target Validation & Payload Size Check
    if (!data.target || !data.signal) return;

    // Prevent massive payloads (DoS/Tunneling)
    const size = JSON.stringify(data.signal).length;
    if (size > MAX_PAYLOAD_SIZE) {
      console.warn(`Signal too large rejected from ${socket.id}`);
      return;
    }

    // Find sender's room by checking socket rooms
    let senderRoomId: string | null = null;
    for (const rid of socket.rooms) {
      if (rid === socket.id) continue; // Skip personal room
      const room = await getRoom(rid);
      if (room && room.players.some((p) => p.id === socket.id)) {
        senderRoomId = rid;
        break;
      }
    }

    if (senderRoomId) {
      const room = await getRoom(senderRoomId);
      if (room) {
        // Ensure target is in the SAME room
        const targetInRoom = room.players.some((p) => p.id === data.target);
        if (targetInRoom) {
          io.to(data.target).emit("signal", {
            sender: socket.id,
            signal: data.signal,
          });
        } else {
          console.warn(
            `Blocked signal from ${socket.id} to ${data.target} (not in same room)`
          );
        }
      }
    }
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    // Use socket.rooms to find which rooms this socket is in
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue; // Skip personal room

      const room = await getRoom(roomId);
      if (!room) continue;

      const player = room.players.find((p) => p.id === socket.id);

      if (player) {
        player.isOnline = false;

        // Notify room that player is offline
        io.to(roomId).emit("player_updated", player);

        // Check if everyone is offline
        const onlinePlayers = room.players.filter((p) => p.isOnline);

        // Host Migration (only to online players)
        if (player.isHost && onlinePlayers.length > 0) {
          const newHost = onlinePlayers[0];
          newHost.isHost = true;
          player.isHost = false;
          room.hostId = newHost.id;
          io.to(roomId).emit("host_migrated", { newHostId: newHost.id });
        }

        // Update room state (resets TTL)
        await updateRoom(roomId, room);

        // No manual cleanup needed - Keyv TTL handles expiration after 1 hour
        if (onlinePlayers.length === 0) {
          console.log(
            `Room ${roomId} is empty. Will auto-delete after 1 hour of inactivity.`
          );
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0"; // Listen on all interfaces for Docker/reverse proxy
httpServer.listen(Number(PORT), HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
