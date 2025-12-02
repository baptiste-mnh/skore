import { X } from "lucide-react";
import { useEffect } from "react";

export const ErrorToast = ({
  message,
  onClose,
  duration = 5000,
}: {
  message: string;
  onClose: () => void;
  duration?: number;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-scale-up">
      <div className="bg-gold/10 border border-gold rounded-xl p-4 shadow-md flex items-center gap-3">
        <div className="shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
          <X size={14} className="text-white" />
        </div>
        <p className="flex-1 text-prussian font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 text-gold hover:text-gold/80 active:scale-95 transition-transform"
          aria-label="Close error"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
