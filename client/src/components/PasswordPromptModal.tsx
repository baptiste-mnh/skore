import { X } from "lucide-react";
import { useState } from "react";

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  roomId: string;
}

export const PasswordPromptModal = ({
  isOpen,
  onClose,
  onSubmit,
  roomId,
}: PasswordPromptModalProps) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 4 && password.length <= 20) {
      onSubmit(password);
      setPassword(""); // Clear for security
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
          className="absolute top-4 right-4 text-slate-400 hover:text-prussian transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-prussian mb-2 text-center">
          Private Room
        </h3>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Enter password for room{" "}
          <span className="font-mono font-bold text-prussian">#{roomId}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-prussian mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter room password"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              minLength={4}
              maxLength={20}
              autoFocus
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Password must be 4-20 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={password.length < 4 || password.length > 20}
            className="w-full py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPromptModal;
