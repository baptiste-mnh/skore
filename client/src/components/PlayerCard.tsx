import { useEffect, useState } from "react";
import type { Player } from "../context/gameContextDef";
import type { ConfirmOptions } from "../models";
import clsx from "clsx";
import { Crown, Minus, Pen, Plus, Trash2 } from "lucide-react";

export const PlayerCard = ({
  player,
  isMe,
  isHost,
  onOpenNumpad,
  onOpenDeltaInput,
  onRemovePlayer,
  onShowConfirm,
}: {
  player: Player;
  isMe: boolean;
  isHost: boolean;
  onOpenNumpad: (player: Player) => void;
  onOpenDeltaInput: (player: Player, isPositive: boolean) => void;
  onRemovePlayer: (playerId: string) => void;
  onShowConfirm: (
    message: string,
    onConfirm: () => void,
    options?: ConfirmOptions
  ) => void;
}) => {
  const [displayScore, setDisplayScore] = useState(player.score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayScore !== player.score) {
      setIsAnimating(true);
      const diff = player.score - displayScore;
      const steps = Math.min(Math.abs(diff), 20);
      const increment = diff / steps;
      const duration = 500;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayScore(player.score);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setDisplayScore((prev: number) => Math.round(prev + increment));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [player.score, displayScore]);

  return (
    <div className="relative">
      <div
        className={clsx(
          "bg-white p-3 rounded-2xl shadow-sm border border-alabaster",
          isMe && "ring-2 ring-gold border-gold"
        )}
      >
        {/* Row 1: Avatar + Name + Badges */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-xl">
              {player.avatar}
            </div>
            {!player.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 border-2 border-white rounded-full"></span>
            )}
          </div>

          <h3 className="font-bold text-xl text-black truncate flex-1">
            {player.name}
            {!player.isOnline && (
              <span className="text-slate-500 font-normal"> (Offline)</span>
            )}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            {player.isHost && (
              <Crown size={12} className="text-gold fill-gold" />
            )}
            {isMe && (
              <span className="px-1.5 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider">
                Me
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Score + Buttons */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onOpenNumpad(player)}
            className="flex items-center gap-1 cursor-pointer active:scale-95 transition-transform select-none flex-1 ml-4"
          >
            <Pen size={11} className="text-slate-400" />
            <span
              className={clsx(
                "text-3xl font-bold transition-colors",
                isAnimating && "text-gold"
              )}
            >
              {displayScore}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenDeltaInput(player, false)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-alabaster text-slate-600 active:scale-95 transition-transform"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => onOpenDeltaInput(player, true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gold text-white active:scale-95 transition-transform shadow-md shadow-gold/20"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {!player.isOnline && isHost && (
        <button
          onClick={() => {
            onShowConfirm(
              `Remove ${player.name} from the game?`,
              () => onRemovePlayer(player.id),
              {
                title: "Remove Player",
                confirmText: "Remove",
                variant: "danger",
              }
            );
          }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-prussian/10 text-prussian hover:bg-prussian/20 hover:text-prussian active:scale-95 transition-all opacity-50 hover:opacity-100"
          title="Remove player"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default PlayerCard;
