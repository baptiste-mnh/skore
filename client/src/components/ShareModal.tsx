import { Share2, X } from "lucide-react";
import QRCode from "react-qr-code";

export const ShareModal = ({
  isOpen,
  onClose,
  roomId,
  onShowAlert,
}: {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  onShowAlert: (message: string, title?: string) => void;
}) => {
  if (!isOpen || !roomId) return null;

  const shareUrl = `${window.location.origin}/${roomId}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Skore Room",
          text: "Come track scores with me!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        onShowAlert("Link copied to clipboard!", "Success");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
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

        <div className="text-center">
          <h3 className="text-xl font-bold text-black mb-2">
            Invite Players
          </h3>
          <p className="text-slate-500 mb-6 text-sm">
            Scan or share the link to join
          </p>

          <div className="bg-alabaster p-4 rounded-xl inline-block mb-6 border border-slate-100">
            <QRCode value={shareUrl} size={160} />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-alabaster rounded-lg text-center font-mono text-lg tracking-widest font-bold select-all">
              {roomId}
            </div>

            <button
              onClick={handleNativeShare}
              className="w-full py-3 bg-gold text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-gold/20"
            >
              <Share2 size={20} />
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
