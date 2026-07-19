"use client";

import {
  LuCircleCheck,
  LuStethoscope,
} from "react-icons/lu";

import ModalShell from "./ModalShell";

import type {
  DoctorAppointment,
} from "./types";

interface CompleteConsultationModalProps {
  isOpen: boolean;
  appointment: DoctorAppointment | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const CompleteConsultationModal = ({
  isOpen,
  appointment,
  isSubmitting,
  onClose,
  onConfirm,
}: CompleteConsultationModalProps) => {
  if (!appointment) {
    return null;
  }

  return (
    <ModalShell
      isOpen={isOpen}
      title="Complete Consultation"
      description="Confirm that this patient consultation has been completed."
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      maxWidthClassName="max-w-lg"
    >
      <div className="space-y-5 p-5">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/25">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm dark:bg-[#2A2233] dark:text-emerald-400">
              <LuStethoscope className="size-6" />
            </span>

            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {
                  appointment.patientName
                }
              </h3>

              <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {
                  appointment.problemTitle
                }
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#CDBFD0]">
                {
                  appointment.appointmentDate
                }{" "}
                at{" "}
                {
                  appointment.appointmentTime
                }
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600 dark:text-[#CDBFD0]">
          Completing the consultation will
          close this appointment. The patient
          will then be allowed to request a new
          appointment with you.
        </p>

        <div className="flex flex-col-reverse gap-2 border-t border-[#F5CBCB] pt-5 dark:border-[#41354A] sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#5D4C69] dark:text-white dark:hover:bg-[#352B3D]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              void onConfirm()
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuCircleCheck className="size-5" />

            {isSubmitting
              ? "Completing..."
              : "Confirm Completion"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default CompleteConsultationModal;