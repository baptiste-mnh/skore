import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isHost: boolean;
  isOnline: boolean;
}

export interface GameState {
  players: Player[];
  logs: string[];
  roomId: string | null;
  currentPlayer: Player | null;
}

export interface GameContextType {
  gameState: GameState;
  createRoom: (name: string, avatar: string) => void;
  joinRoom: (roomId: string, name: string, avatar: string) => void;
  rejoinRoom: (roomId: string, oldPlayerId: string) => void;
  checkRoom: (roomId: string) => void;
  updateScore: (playerId: string, delta: number) => void;
  updatePlayerName: (roomId: string, newName: string, avatar: string) => void;
  resetGame: () => void;
  removePlayer: (playerId: string) => void;
  addOfflinePlayer: (roomId: string, name: string, avatar: string) => void;
  socket: Socket | null;
  isConnected: boolean;
  roomStatus: Player[] | null;
  clearRoomStatus: () => void;
  error: string | null;
  clearError: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);






