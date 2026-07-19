"use client";

import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { LuX } from "react-icons/lu";

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}

const ModalShell = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  maxWidthClassName = "max-w-3xl",
}: ModalShellProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`max-h-[96vh] w-full overflow-hidden rounded-2xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233] sm:max-h-[92vh] sm:rounded-3xl ${maxWidthClassName}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#F5CBCB] p-4 dark:border-[#41354A] sm:gap-4 sm:p-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#A997AE] sm:text-sm">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#352B3D] dark:hover:text-white"
            aria-label="Close modal"
          >
            <LuX className="size-5" />
          </button>
        </header>

        <div className="max-h-[calc(96vh-82px)] overflow-y-auto sm:max-h-[calc(92vh-90px)]">
          {children}
        </div>
      </section>
    </div>
  );
};

export default ModalShell;