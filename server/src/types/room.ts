export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isHost: boolean;
  isOnline: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  hostId: string;
  passwordHash: string | null; // null = public room, string = bcrypt hash for private room
}
