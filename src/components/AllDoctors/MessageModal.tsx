"use client";

import {
  useEffect,
  useId,
} from "react";
import {
  LuCircleAlert,
  LuX,
} from "react-icons/lu";

interface MessageModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

const MessageModal = ({
  isOpen,
  title,
  message,
  onClose,
  buttonText = "Okay",
}: MessageModalProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          descriptionId
        }
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233]"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F5CBCB] p-5 dark:border-[#41354A]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <LuCircleAlert className="size-5" />
            </span>

            <h3
              id={titleId}
              className="break-words text-lg font-black text-slate-900 dark:text-white"
            >
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#745D83] dark:hover:bg-[#352B3D] dark:hover:text-white"
            aria-label="Close modal"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <p
            id={descriptionId}
            className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-[#CDBFD0]"
          >
            {message}
          </p>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl bg-[#745D83] px-5 text-sm font-bold text-white transition hover:bg-[#614E70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#745D83] focus-visible:ring-offset-2 dark:bg-[#C5B3D3] dark:text-[#211B27] dark:hover:bg-[#F5CBCB]"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;