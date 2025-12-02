import { useState } from "react";

export const DeltaInputModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPositive,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (delta: number) => void;
  isPositive: boolean;
}) => {
  const [value, setValue] = useState("0");

  if (!isOpen) return null;

  // Vibration helper function
  const vibrate = (duration: number = 10) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  };

  const handlePress = (num: string) => {
    vibrate(10); // Short vibration for number presses
    if (value === "0" && num !== "DEL") setValue(num);
    else setValue((prev) => prev + num);
  };

  const handleDelete = () => {
    vibrate(15); // Slightly longer vibration for delete
    setValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleConfirm = () => {
    vibrate(20); // Longer vibration for confirm
    const numValue = parseInt(value, 10);
    if (numValue > 0) {
      onSubmit(isPositive ? numValue : -numValue);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm p-4 rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-sm text-slate-500 mb-2">
            {isPositive ? "Add points" : "Subtract points"}
          </div>
          <div className="text-4xl font-bold text-black">{value}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handlePress(n.toString())}
              className="p-4 text-2xl font-medium bg-alabaster rounded-xl active:bg-prussian/10"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="p-4 text-xl font-medium bg-prussian/10 text-prussian rounded-xl active:bg-prussian/20"
          >
            DEL
          </button>
          <button
            onClick={() => handlePress("0")}
            className="p-4 text-2xl font-medium bg-alabaster rounded-xl active:bg-prussian/10"
          >
            0
          </button>
          <button
            onClick={handleConfirm}
            className="p-4 text-xl font-medium bg-gold text-white rounded-xl active:bg-gold/90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeltaInputModal;
