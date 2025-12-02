import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export const EditProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  initialAvatar,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, avatar: string) => void;
  initialName: string;
  initialAvatar: string;
}) => {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);

  if (!isOpen) return null;

  const avatars = ["🦁", "🐯", "🐻", "🦅", "🦊", "🐼", "🐺", "🦄", "🐲", "🦖"];

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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-black mb-6 text-center">
          Edit Profile
        </h3>

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
                      ? "bg-gold/10 ring-2 ring-gold scale-110"
                      : "bg-alabaster hover:bg-gold/5"
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
              className="w-full p-3 rounded-xl border border-alabaster focus:ring-2 focus:ring-gold outline-none transition-all"
              maxLength={20}
            />
          </div>

          <button
            onClick={() => {
              onSubmit(name, avatar);
              onClose();
            }}
            className="w-full py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
