import clsx from "clsx";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = "Confirm",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl animate-scale-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-black mb-3 text-center">
          {title}
        </h3>
        <p className="text-prussian text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-alabaster text-black rounded-xl font-bold active:scale-95 transition-transform"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={clsx(
              "flex-1 py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-lg",
              variant === "danger"
                ? "bg-prussian text-white shadow-prussian/20"
                : "bg-gold text-white shadow-gold/20"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
