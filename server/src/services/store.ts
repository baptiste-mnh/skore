import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import type { Room } from "../types/room";

// In-memory if KEYV_URI empty, Redis if URL provided
const KEYV_URI = process.env.KEYV_URI;
const ROOM_TTL = parseInt(process.env.ROOM_TTL_MS || "3600000"); // 1 hour in ms
export const SOCKET_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms (safety cleanup)

// If URI is provided, use Redis adapter; otherwise Keyv defaults to in-memory Map
export const store = KEYV_URI
  ? new Keyv({ store: new KeyvRedis(KEYV_URI), namespace: "room" })
  : new Keyv({ namespace: "room" });

// Socket-to-room mapping store (to track which room a socket is in)
export const socketStore = KEYV_URI
  ? new Keyv({ store: new KeyvRedis(KEYV_URI), namespace: "socket" })
  : new Keyv({ namespace: "socket" });

store.on("error", (err) => console.error("Store Error:", err));
socketStore.on("error", (err) => console.error("Socket Store Error:", err));

console.log(`✅ Store initialized: ${KEYV_URI ? "Redis" : "In-memory"}`);

// === Room Operations ===

export const createRoom = async (roomId: string, room: Room): Promise<void> => {
  await store.set(roomId, room, ROOM_TTL);
};

export const getRoom = async (roomId: string): Promise<Room | undefined> => {
  return await store.get(roomId);
};

export const updateRoom = async (roomId: string, room: Room): Promise<void> => {
  // Reset TTL on every update
  await store.set(roomId, room, ROOM_TTL);
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  await store.delete(roomId);
};

export const roomExists = async (roomId: string): Promise<boolean> => {
  return await store.has(roomId);
};
