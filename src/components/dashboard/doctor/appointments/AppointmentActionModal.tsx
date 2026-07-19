"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  LuCalendarClock,
  LuCheck,
  LuX,
} from "react-icons/lu";

import ModalShell from "./ModalShell";

import type {
  AppointmentStatus,
  DoctorAppointment,
} from "./types";

interface AppointmentActionModalProps {
  isOpen: boolean;
  appointment: DoctorAppointment | null;
  isSubmitting: boolean;
  onClose: () => void;

  onOpenReschedule: (
    appointment: DoctorAppointment,
  ) => void;

  onSubmit: (
    status: Exclude<
      AppointmentStatus,
      "pending"
    >,
    rejectionReason?: string,
  ) => Promise<void>;
}

const AppointmentActionModal = ({
  isOpen,
  appointment,
  isSubmitting,
  onClose,
  onOpenReschedule,
  onSubmit,
}: AppointmentActionModalProps) => {
  const [
    showRejectForm,
    setShowRejectForm,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setShowRejectForm(false);
      setRejectionReason("");
    }
  }, [isOpen]);

  if (!appointment) {
    return null;
  }

  const isPending =
    appointment.status === "pending";

  const isApproved =
    appointment.status === "approved";

  const isRejected =
    appointment.status === "rejected";

  return (
    <ModalShell
      isOpen={isOpen}
      title="Manage Appointment"
      description={`${appointment.patientName} — ${appointment.problemTitle}`}
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-5 p-5">
        <div className="rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Current Status
              </p>

              <p className="mt-1 font-black capitalize text-slate-900 dark:text-white">
                {appointment.status}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Schedule
              </p>

              <p className="mt-1 font-black text-slate-900 dark:text-white">
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

        {isRejected &&
          appointment.rejectionReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/25">
              <p className="text-xs font-black uppercase tracking-wide text-red-500">
                Previous Rejection Message
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-red-700 dark:text-red-300">
                {
                  appointment.rejectionReason
                }
              </p>
            </div>
          )}

        {showRejectForm ? (
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-800 dark:text-white">
              Rejection Message

              <textarea
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value,
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Explain why this appointment is being rejected..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
              />
            </label>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
                className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-black text-slate-700 disabled:opacity-50 dark:border-[#5D4C69] dark:text-white"
              >
                Back
              </button>

              <button
                type="button"
                disabled={
                  isSubmitting ||
                  !rejectionReason.trim()
                }
                onClick={() =>
                  void onSubmit(
                    "rejected",
                    rejectionReason.trim(),
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuX className="size-4" />
                Confirm Rejection
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(isPending || isRejected) && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  void onSubmit(
                    "approved",
                  )
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuCheck className="size-5" />

                {isRejected
                  ? "Approve Rejected Appointment"
                  : "Approve Appointment"}
              </button>
            )}

            {(isPending ||
              isApproved ||
              isRejected) && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  onOpenReschedule(
                    appointment,
                  )
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#C5B3D3] bg-[#FBEFEF] px-5 text-sm font-black text-[#614E70] transition hover:bg-[#FFE2E2] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB] dark:hover:bg-[#41354A]"
              >
                <LuCalendarClock className="size-5" />
                Reschedule Appointment
              </button>
            )}

            {(isPending || isApproved) && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  setShowRejectForm(true)
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400"
              >
                <LuX className="size-5" />
                Reject Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default AppointmentActionModal;