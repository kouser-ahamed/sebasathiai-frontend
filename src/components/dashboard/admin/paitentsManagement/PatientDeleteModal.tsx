"use client";

import { useEffect } from "react";
import {
  LuLoaderCircle,
  LuTrash2,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";

import PatientAvatar from "./PatientAvatar";
import { AdminManagedPatient } from "./ index";

interface PatientDeleteModalProps {
  patient: AdminManagedPatient | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (patient: AdminManagedPatient) => void;
}

const PatientDeleteModal = ({
  patient,
  isDeleting,
  onClose,
  onConfirm,
}: PatientDeleteModalProps) => {
  useEffect(() => {
    if (!patient) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [patient, isDeleting, onClose]);

  if (!patient) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-patient-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-200 bg-white shadow-2xl dark:border-red-900/60 dark:bg-[#2A2233]">
        <div className="flex items-start justify-between gap-4 border-b border-red-100 p-5 dark:border-red-900/40 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <LuTriangleAlert className="size-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="delete-patient-title"
                className="text-lg font-black text-slate-950 dark:text-white"
              >
                Delete Patient Account?
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#BFAFC3]">
                This permanently removes the patient from the user collection and removes their authentication sessions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
            aria-label="Close delete confirmation"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/20">
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

          <p className="mt-4 text-sm font-bold leading-6 text-red-600 dark:text-red-300">
            This action cannot be undone. Historical healthcare records are not automatically removed by this account deletion endpoint.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-red-100 p-5 dark:border-red-900/40 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 rounded-xl border border-[#F5CBCB] bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:opacity-50 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(patient)}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <LuLoaderCircle className="size-4 animate-spin" />
            ) : (
              <LuTrash2 className="size-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDeleteModal;