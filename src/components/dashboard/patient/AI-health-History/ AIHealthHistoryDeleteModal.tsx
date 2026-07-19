"use client";

import { useEffect } from "react";
import {
  LuCalendarClock,
  LuLoaderCircle,
  LuLockKeyhole,
  LuTrash2,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { PatientAIHealthHistory } from "./ types";



interface AIHealthHistoryDeleteModalProps {
  history: PatientAIHealthHistory | null;
  canDelete: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const formatDateTime = (value: string | null): string => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const AIHealthHistoryDeleteModal = ({
  history,
  canDelete,
  isDeleting,
  onClose,
  onConfirm,
}: AIHealthHistoryDeleteModalProps) => {
  useEffect(() => {
    if (!history) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [history, isDeleting, onClose]);

  if (!history) return null;

  const title =
    history.conversationTitle ||
    history.report.reportTitle ||
    "AI Health Summary";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-ai-health-history-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233]">
        <div className="flex items-start justify-between gap-4 border-b border-[#F5CBCB] p-5 dark:border-[#41354A] sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                canDelete
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
              }`}
            >
              {canDelete ? (
                <LuTriangleAlert className="size-5" />
              ) : (
                <LuLockKeyhole className="size-5" />
              )}
            </span>

            <div className="min-w-0">
              <h3
                id="delete-ai-health-history-title"
                className="text-lg font-black text-slate-950 dark:text-white"
              >
                {canDelete
                  ? "Delete AI Health History?"
                  : "Delete unavailable"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#BFAFC3]">
                {canDelete
                  ? "This saved summary and its report details will be permanently removed."
                  : "Your account is blocked, so you can view saved history but cannot delete it."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#352B3D] dark:hover:text-white"
            aria-label="Close delete history modal"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">
              Selected history
            </p>

            <p className="mt-1 break-words text-sm font-black leading-6 text-slate-900 dark:text-white">
              {title}
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <LuCalendarClock className="size-3.5" />
              Updated {formatDateTime(history.updatedAt || history.createdAt)}
            </p>
          </div>

          {canDelete && (
            <p className="mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400">
              Once deleted, this saved summary cannot be recovered.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#F5CBCB] p-5 dark:border-[#41354A] sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 w-full rounded-xl border border-[#F5CBCB] bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A] sm:w-auto"
          >
            {canDelete ? "Cancel" : "Close"}
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isDeleting ? (
                <LuLoaderCircle className="size-4 animate-spin" />
              ) : (
                <LuTrash2 className="size-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete History"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHealthHistoryDeleteModal;