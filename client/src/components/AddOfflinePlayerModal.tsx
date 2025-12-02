import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export const AddOfflinePlayerModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, avatar: string) => void;
}) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🎮");

  if (!isOpen) return null;

  const avatars = ["🎮", "🎯", "🎲", "🃏", "🎪", "🎨", "🎭", "🎬", "🎸", "🎺"];

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim(), avatar);
      setName("");
      setAvatar("🎮");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl animate-scale-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-prussian"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-black mb-2 text-center">
          Add Offline Player
        </h3>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Create a player profile for someone without a device
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-prussian mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={clsx(
                    "w-10 h-10 flex items-center justify-center rounded-full text-lg transition-all",
                    avatar === av
                      ? "bg-indigo-100 ring-2 ring-indigo-500 scale-110"
                      : "bg-alabaster hover:bg-alabaster"
                  )}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-prussian mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Player 2"
              className="w-full p-3 rounded-xl border border-alabaster focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOfflinePlayerModal;
