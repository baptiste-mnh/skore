import type { Player } from "../context/gameContextDef";
import { X } from "lucide-react";

export const TakeControlModal = ({
  isOpen,
  onClose,
  offlinePlayers,
  onTakeControl,
  onCreateNew,
}: {
  isOpen: boolean;
  onClose: () => void;
  offlinePlayers: Player[];
  onTakeControl: (playerId: string) => void;
  onCreateNew: () => void;
}) => {
  if (!isOpen) return null;

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

        <h3 className="text-xl font-bold text-black mb-2 text-center">
          Join Room
        </h3>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Take control of an offline player or create a new one
        </p>

        <div className="space-y-3 mb-6">
          <p className="text-xs font-medium text-prussian mb-2">
            Available Offline Players:
          </p>
          {offlinePlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => onTakeControl(player.id)}
              className="w-full p-3 bg-alabaster hover:bg-gold/10 rounded-xl flex items-center gap-3 transition-colors border border-alabaster hover:border-gold"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl border border-alabaster">
                {player.avatar}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-black">{player.name}</div>
                <div className="text-xs text-slate-500">
                  Score: {player.score}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-alabaster"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-500">or</span>
          </div>
        </div>

        <button
          onClick={onCreateNew}
          className="w-full py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform"
        >
          Create New Player
        </button>
      </div>
    </div>
  );
};

export default TakeControlModal;
