import React, { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  GameContext,
  type GameState,
  type Player,
  type RoomStatus,
} from "./gameContextDef";

// Re-export types for convenience
export type {
  Player,
  GameState,
  GameContextType,
  RoomStatus,
} from "./gameContextDef";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    logs: [],
    roomId: null,
    currentPlayer: null,
  });

  // Initialize socket connection once
  useEffect(() => {
    console.debug("🔌 Creating socket connection to:", SERVER_URL);

    const socketInstance = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection handlers
    socketInstance.on("connect", () => {
      console.debug("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.debug("❌ Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // App error handler
    socketInstance.on("app_error", ({ message }: { message: string }) => {
      console.debug("🔴 app_error received:", message);
      setError(message);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.debug("🔌 Disconnecting socket");
      socketInstance.disconnect();
    };
  }, []);

  // Register game event listeners when socket is ready
  useEffect(() => {
    if (!socket) return;

    socket.on(
      "room_created",
      ({
        roomId,
        player,
        accessToken,
        isPrivate,
      }: {
        roomId: string;
        player: Player;
        accessToken?: string;
        isPrivate?: boolean;
      }) => {
        // Store access token if private room
        if (accessToken) {
          localStorage.setItem(`skore_access_token_${roomId}`, accessToken);
        }

        setGameState((prev) => ({
          ...prev,
          roomId,
          players: [player],
          currentPlayer: player,
          logs: [
            ...prev.logs,
            `Room created by ${player.name}${isPrivate ? " (private)" : ""}`,
          ],
        }));
      }
    );

    socket.on(
      "room_status",
      ({ players, isPrivate }: { players: Player[]; isPrivate?: boolean }) => {
        setRoomStatus({ players, isPrivate });
      }
    );

    socket.on(
      "room_joined",
      ({
        roomId,
        players,
        accessToken,
        isPrivate,
      }: {
        roomId: string;
        players: Player[];
        accessToken?: string;
        isPrivate?: boolean;
      }) => {
        const me = players.find((p: Player) => p.id === socket.id);

        // Store access token if private room
        if (accessToken) {
          localStorage.setItem(`skore_access_token_${roomId}`, accessToken);
        }

        setGameState((prev) => ({
          ...prev,
          roomId,
          players,
          currentPlayer: me || null,
          logs: [
            ...prev.logs,
            `Joined room ${roomId}${isPrivate ? " (private)" : ""}`,
          ],
        }));
      }
    );

    socket.on("player_joined", (player: Player) => {
      setGameState((prev) => {
        const playerExists = prev.players.some((p) => p.id === player.id);
        if (playerExists) {
          console.warn(
            `Player ${player.name} already exists, skipping duplicate`
          );
          return prev;
        }

        return {
          ...prev,
          players: [...prev.players, player],
          logs: [...prev.logs, `${player.name} joined the game`],
        };
      });
    });

    socket.on("player_updated", (data: Player & { oldId?: string }) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) => {
          const isMatch =
            p.id === data.id || (data.oldId && p.id === data.oldId);
          if (isMatch) {
            return {
              ...p,
              id: data.id,
              isOnline: data.isOnline,
              name: data.name,
              avatar: data.avatar,
              score: data.score,
              isHost: data.isHost,
            };
          }
          return p;
        }),
        logs: data.isOnline
          ? [...prev.logs, `${data.name} came back`]
          : [...prev.logs, `${data.name} disconnected`],
      }));
    });

    socket.on("player_left", ({ playerId }: { playerId: string }) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.filter((p) => p.id !== playerId),
        logs: [...prev.logs, `Player left the game`],
      }));
    });

    socket.on("host_migrated", ({ newHostId }: { newHostId: string }) => {
      setGameState((prev) => {
        const updatedPlayers = prev.players.map(
          (p) =>
            p.id === newHostId
              ? { ...p, isHost: true } // New host
              : { ...p, isHost: false } // Remove host from all others
        );

        let updatedCurrentPlayer = prev.currentPlayer;
        if (updatedCurrentPlayer) {
          updatedCurrentPlayer = {
            ...updatedCurrentPlayer,
            isHost: updatedCurrentPlayer.id === newHostId,
          };
        }

        if (updatedCurrentPlayer && updatedCurrentPlayer.id === socket.id) {
          localStorage.setItem(`skore_user_${prev.roomId}`, socket.id);
        }

        return {
          ...prev,
          players: updatedPlayers,
          currentPlayer: updatedCurrentPlayer,
          logs: [...prev.logs, `Host migrated`],
        };
      });
    });

    socket.on(
      "score_updated",
      ({ playerId, newScore }: { playerId: string; newScore: number }) => {
        setGameState((prev) => ({
          ...prev,
          players: prev.players.map((p) =>
            p.id === playerId ? { ...p, score: newScore } : p
          ),
        }));
      }
    );

    socket.on(
      "player_name_updated",
      ({
        playerId,
        name,
        avatar,
      }: {
        playerId: string;
        name: string;
        avatar: string;
      }) => {
        setGameState((prev) => ({
          ...prev,
          players: prev.players.map((p) =>
            p.id === playerId ? { ...p, name, avatar } : p
          ),
          currentPlayer:
            prev.currentPlayer?.id === playerId
              ? { ...prev.currentPlayer, name, avatar }
              : prev.currentPlayer,
          logs: [...prev.logs, `Player updated profile`],
        }));
      }
    );

    socket.on("game_reset", () => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) => ({ ...p, score: 0 })),
        logs: [...prev.logs, `Game Reset!`],
      }));
    });

    socket.on("player_removed", ({ playerId }: { playerId: string }) => {
      setGameState((prev) => {
        const removedPlayer = prev.players.find((p) => p.id === playerId);
        return {
          ...prev,
          players: prev.players.filter((p) => p.id !== playerId),
          logs: removedPlayer
            ? [...prev.logs, `${removedPlayer.name} was removed`]
            : [...prev.logs, `Player was removed`],
        };
      });
    });

    return () => {
      socket.off("room_created");
      socket.off("room_status");
      socket.off("room_joined");
      socket.off("player_joined");
      socket.off("player_updated");
      socket.off("player_left");
      socket.off("host_migrated");
      socket.off("score_updated");
      socket.off("player_name_updated");
      socket.off("game_reset");
      socket.off("player_removed");
    };
  }, [socket]);

  const createRoom = (name: string, avatar: string, password?: string) => {
    if (!socket || !isConnected) {
      console.error("❌ Cannot create room: socket not connected");
      return;
    }
    console.debug("📤 Emitting create_room", {
      playerName: name,
      avatar,
      hasPassword: !!password,
    });
    socket.emit("create_room", { playerName: name, avatar, password });
  };

  const checkRoom = (roomId: string) => {
    if (!socket || !isConnected) {
      console.error("❌ Cannot check room: socket not connected");
      return;
    }
    socket.emit("check_room", { roomId });
  };

  const joinRoom = (
    roomId: string,
    name: string,
    avatar: string,
    password?: string,
    accessToken?: string
  ) => {
    if (!socket || !isConnected) {
      console.error("❌ Cannot join room: socket not connected");
      return;
    }
    socket.emit("join_room", {
      roomId,
      playerName: name,
      avatar,
      password,
      accessToken,
    });
  };

  const rejoinRoom = (
    roomId: string,
    oldPlayerId: string,
    password?: string,
    accessToken?: string
  ) => {
    if (!socket || !isConnected) {
      console.error("❌ Cannot rejoin room: socket not connected");
      return;
    }
    socket.emit("rejoin_room", { roomId, oldPlayerId, password, accessToken });
  };

  const updateScore = (playerId: string, delta: number) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, score: p.score + delta };
        }
        return p;
      });

      const targetPlayer = updatedPlayers.find((p) => p.id === playerId);
      if (targetPlayer && socket && isConnected) {
        socket.emit("update_score", {
          roomId: prev.roomId,
          playerId,
          newScore: targetPlayer.score,
        });
      }

      return { ...prev, players: updatedPlayers };
    });
  };

  const updatePlayerName = (
    roomId: string,
    newName: string,
    avatar: string
  ) => {
    if (socket && isConnected) {
      socket.emit("update_player_name", { roomId, newName, avatar });
    }
  };

  const resetGame = () => {
    if (socket && isConnected && gameState.roomId) {
      socket.emit("reset_game", { roomId: gameState.roomId });
    }
  };

  const removePlayer = (playerId: string) => {
    if (socket && isConnected && gameState.roomId) {
      socket.emit("remove_player", {
        roomId: gameState.roomId,
        playerId,
      });
    }
  };

  const addOfflinePlayer = (roomId: string, name: string, avatar: string) => {
    if (socket && isConnected) {
      socket.emit("add_offline_player", {
        roomId,
        playerName: name,
        avatar,
      });
    }
  };

  const clearRoomStatus = () => setRoomStatus(null);
  const clearError = () => setError(null);

  const contextValue = useMemo(
    () => ({
      gameState,
      createRoom,
      joinRoom,
      rejoinRoom,
      checkRoom,
      updateScore,
      updatePlayerName,
      resetGame,
      removePlayer,
      addOfflinePlayer,
      socket,
      isConnected,
      roomStatus,
      clearRoomStatus,
      error,
      clearError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState, roomStatus, error, socket, isConnected]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
