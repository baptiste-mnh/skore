import { Trophy, X, Crown } from "lucide-react";
import type { Player } from "../context/gameContextDef";
import clsx from "clsx";

export const LeaderboardModal = ({
  isOpen,
  onClose,
  players,
  currentPlayerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  currentPlayerId: string | null;
}) => {
  if (!isOpen) return null;

  // Sort players by score (descending), then by name for ties
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.name.localeCompare(b.name);
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl animate-scale-up relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-prussian"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="text-gold" size={28} />
            <h3 className="text-xl font-bold text-black">Leaderboard</h3>
          </div>
          <p className="text-slate-500 text-sm">Ranked by score</p>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const rankIcon = getRankIcon(rank);
            const isCurrentPlayer = player.id === currentPlayerId;

            return (
              <div
                key={player.id}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  isCurrentPlayer
                    ? "bg-gold/10 border-gold ring-2 ring-gold"
                    : "bg-alabaster border-alabaster"
                )}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  {rankIcon ? (
                    <span className="text-2xl">{rankIcon}</span>
                  ) : (
                    <span
                      className={clsx(
                        "text-sm font-bold",
                        isCurrentPlayer ? "text-gold" : "text-slate-400"
                      )}
                    >
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-xl">
                    {player.avatar}
                  </div>
                  {!player.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Name and badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={clsx(
                        "font-bold truncate",
                        isCurrentPlayer ? "text-gold" : "text-black"
                      )}
                    >
                      {player.name}
                    </h4>
                    {player.isHost && (
                      <Crown size={12} className="text-gold fill-gold shrink-0" />
                    )}
                    {isCurrentPlayer && (
                      <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">
                        Me
                      </span>
                    )}
                  </div>
                  {!player.isOnline && (
                    <p className="text-xs text-slate-500">Offline</p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className={clsx(
                      "text-xl font-bold",
                      isCurrentPlayer ? "text-gold" : "text-prussian"
                    )}
                  >
                    {player.score}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;




