"use client";

import { useEffect } from "react";
import {
  LuBan,
  LuCircleCheck,
  LuLoaderCircle,
  LuShieldAlert,
  LuX,
} from "react-icons/lu";

import PatientAvatar from "./PatientAvatar";
import { AdminManagedPatient } from "./ index";

interface PatientStatusModalProps {
  patient: AdminManagedPatient | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (patient: AdminManagedPatient) => void;
}

const PatientStatusModal = ({
  patient,
  isSubmitting,
  onClose,
  onConfirm,
}: PatientStatusModalProps) => {
  useEffect(() => {
    if (!patient) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [patient, isSubmitting, onClose]);

  if (!patient) return null;

  const willBlock = patient.status === "active";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-status-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233]">
        <div className="flex items-start justify-between gap-4 border-b border-[#F5CBCB] p-5 dark:border-[#41354A] sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                willBlock
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              }`}
            >
              {willBlock ? (
                <LuBan className="size-5" />
              ) : (
                <LuCircleCheck className="size-5" />
              )}
            </span>

            <div className="min-w-0">
              <h2
                id="patient-status-title"
                className="text-lg font-black text-slate-950 dark:text-white"
              >
                {willBlock ? "Block Patient?" : "Unblock Patient?"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#BFAFC3]">
                {willBlock
                  ? "The patient will lose access to protected actions until an administrator activates the account again."
                  : "The patient will regain normal access to the application."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] disabled:opacity-50 dark:hover:bg-[#352B3D]"
            aria-label="Close status confirmation"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70">
            <PatientAvatar patient={patient} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                {patient.name || "Unnamed patient"}
              </p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-[#A997AE]">
                {patient.email}
              </p>
            </div>
          </div>

          {willBlock && (
            <p className="mt-4 flex items-start gap-2 text-sm font-semibold leading-6 text-amber-700 dark:text-amber-300">
              <LuShieldAlert className="mt-1 size-4 shrink-0" />
              Existing login sessions will be removed when this patient is blocked.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#F5CBCB] p-5 dark:border-[#41354A] sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 rounded-xl border border-[#F5CBCB] bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:opacity-50 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(patient)}
            disabled={isSubmitting}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              willBlock
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? (
              <LuLoaderCircle className="size-4 animate-spin" />
            ) : willBlock ? (
              <LuBan className="size-4" />
            ) : (
              <LuCircleCheck className="size-4" />
            )}
            {isSubmitting
              ? "Updating..."
              : willBlock
                ? "Block Patient"
                : "Unblock Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientStatusModal;