export const AlertModal = ({
  isOpen,
  onClose,
  message,
  title = "Info",
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
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
        <button
          onClick={onClose}
          className="w-full py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
