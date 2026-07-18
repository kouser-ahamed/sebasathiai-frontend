"use client";

import { LuLoaderCircle } from "react-icons/lu";
import ModalShell from "./ModalShell";


interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone: "danger" | "warning" | "success";
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  tone,
  isSubmitting,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) => {
  const toneClasses = {
    danger:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-300",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-300",
  };

  const buttonClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    success: "bg-emerald-600 hover:bg-emerald-700",
  };

  return (
    <ModalShell
      isOpen={isOpen}
      title={title}
      onClose={isSubmitting ? () => undefined : onClose}
      sizeClassName="max-w-md"
    >
      <div className="p-5">
        <div className={`rounded-2xl border p-4 text-sm leading-6 ${toneClasses[tone]}`}>
          {description}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-bold text-slate-700 transition hover:bg-[#FBEFEF] disabled:opacity-60 dark:border-[#5D4C69] dark:text-[#E7DDE8] dark:hover:bg-[#352B3D]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClasses[tone]}`}
          >
            {isSubmitting && <LuLoaderCircle className="size-4 animate-spin" />}
            {isSubmitting ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default ConfirmActionModal;