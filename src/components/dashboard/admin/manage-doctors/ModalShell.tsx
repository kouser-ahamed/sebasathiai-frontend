"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { LuX } from "react-icons/lu";

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  sizeClassName?: string;
}

const ModalShell = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  sizeClassName = "max-w-2xl",
}: ModalShellProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className={`max-h-[92dvh] w-full overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#5D4C69] dark:bg-[#2A2233] ${sizeClassName}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#F5CBCB] px-5 py-4 dark:border-[#41354A]">
          <div>
            <h2
              id="doctor-modal-title"
              className="text-lg font-black text-slate-900 dark:text-white"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#CDBFD0]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#FBEFEF] hover:text-[#745D83] dark:text-[#CDBFD0] dark:hover:bg-[#352B3D] dark:hover:text-[#FFE2E2]"
            aria-label="Close modal"
          >
            <LuX className="size-5" />
          </button>
        </header>

        <div className="max-h-[calc(92dvh-86px)] overflow-y-auto">
          {children}
        </div>
      </section>
    </div>
  );
};

export default ModalShell;