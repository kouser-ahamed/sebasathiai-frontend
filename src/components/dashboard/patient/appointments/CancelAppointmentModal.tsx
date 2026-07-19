"use client";

import { LuCalendarX, LuTriangleAlert } from "react-icons/lu";
import ModalShell from "./ModalShell";
import type { PatientAppointment } from "./types";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointment: PatientAppointment | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const CancelAppointmentModal = ({
  isOpen,
  appointment,
  isSubmitting,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) => {
  if (!appointment) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      title="Cancel Appointment"
      description="This permanently removes the appointment from your appointment history."
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      maxWidthClassName="max-w-lg"
    >
      <div className="space-y-5 p-4 sm:p-5">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/25">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm dark:bg-[#2A2233] dark:text-red-400">
              <LuTriangleAlert className="size-6" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">{appointment.doctorName}</h3>
              <p className="mt-1 text-sm font-bold text-red-700 dark:text-red-400">{appointment.problemTitle}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#CDBFD0]">
                {appointment.appointmentDate} at {appointment.appointmentTime}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600 dark:text-[#CDBFD0]">
          The appointment will be deleted from the appointment collection. This action cannot be undone.
        </p>

        <div className="flex flex-col-reverse gap-2 border-t border-[#F5CBCB] pt-5 dark:border-[#41354A] sm:flex-row sm:justify-end">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-black text-slate-700 disabled:opacity-50 dark:border-[#5D4C69] dark:text-white">
            Keep Appointment
          </button>
          <button type="button" disabled={isSubmitting} onClick={() => void onConfirm()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50">
            <LuCalendarX className="size-5" />
            {isSubmitting ? "Cancelling..." : "Cancel & Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default CancelAppointmentModal;