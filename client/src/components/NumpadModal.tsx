import clsx from "clsx";
import { useState } from "react";

export const NumpadModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (val: number) => void;
  initialValue: number;
}) => {
  const [value, setValue] = useState(initialValue.toString());

  if (!isOpen) return null;

  const handlePress = (num: string) => {
    if (value === initialValue.toString() && num !== "DEL") {
      setValue(num);
    } else if (value === "0" && num !== "DEL") {
      setValue(num);
    } else {
      setValue((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleConfirm = () => {
    onSubmit(parseInt(value, 10));
    onClose();
  };

  const currentValue = parseInt(value, 10);
  const hasChanged = currentValue !== initialValue;

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
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-slate-400 line-through">
              {initialValue}
            </span>
            <span className="text-slate-400">→</span>
            <span
              className={clsx(
                "text-4xl font-bold",
                hasChanged ? "text-gold" : "text-black"
              )}
            >
              {value}
            </span>
          </div>
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

export default NumpadModal;
