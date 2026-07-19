"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LuCalendarClock,
  LuCalendarDays,
  LuClock3,
} from "react-icons/lu";

import ModalShell from "./ModalShell";

import type {
  DoctorAppointment,
} from "./types";

interface DoctorRescheduleModalProps {
  isOpen: boolean;
  appointment: DoctorAppointment | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    appointmentDate: string,
    appointmentTime: string,
    rescheduleReason: string,
  ) => Promise<void>;
}

const getToday = (): string => {
  const now = new Date();
  const offset =
    now.getTimezoneOffset() * 60_000;

  return new Date(
    now.getTime() - offset,
  )
    .toISOString()
    .slice(0, 10);
};

const DoctorRescheduleModal = ({
  isOpen,
  appointment,
  isSubmitting,
  onClose,
  onSubmit,
}: DoctorRescheduleModalProps) => {
  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [rescheduleReason, setRescheduleReason] =
    useState("");

  const today = useMemo(
    () => getToday(),
    [],
  );

  useEffect(() => {
    if (!isOpen || !appointment) {
      return;
    }

    setAppointmentDate(
      appointment.appointmentDate,
    );

    setAppointmentTime(
      appointment.appointmentTime,
    );

    setRescheduleReason(
      appointment.rescheduleReason || "",
    );
  }, [isOpen, appointment]);

  if (!appointment) {
    return null;
  }

  const canSubmit =
    appointmentDate >= today &&
    Boolean(appointmentTime);

  return (
    <ModalShell
      isOpen={isOpen}
      title="Reschedule Appointment"
      description={`${appointment.patientName} — ${appointment.problemTitle}`}
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      maxWidthClassName="max-w-xl"
    >
      <form
        className="space-y-5 p-5"
        onSubmit={(event) => {
          event.preventDefault();

          if (!canSubmit) {
            return;
          }

          void onSubmit(
            appointmentDate,
            appointmentTime,
            rescheduleReason.trim(),
          );
        }}
      >
        <div className="rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#745D83] shadow-sm dark:bg-[#2A2233] dark:text-[#F5CBCB]">
              <LuCalendarClock className="size-5" />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Current Schedule
              </p>

              <p className="mt-1 font-black text-slate-900 dark:text-white">
                {appointment.appointmentDate} at{" "}
                {appointment.appointmentTime}
              </p>

              <p className="mt-1 text-xs font-semibold capitalize text-slate-500 dark:text-[#A997AE]">
                Status: {appointment.status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-black text-slate-800 dark:text-white">
            New Appointment Date
            <div className="relative mt-2">
              <LuCalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                min={today}
                required
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
              />
            </div>
          </label>

          <label className="block text-sm font-black text-slate-800 dark:text-white">
            New Appointment Time
            <div className="relative mt-2">
              <LuClock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="time"
                required
                value={appointmentTime}
                onChange={(event) =>
                  setAppointmentTime(
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
              />
            </div>
          </label>
        </div>

        <label className="block text-sm font-black text-slate-800 dark:text-white">
          Reschedule Reason
          <textarea
            rows={4}
            maxLength={1000}
            value={rescheduleReason}
            onChange={(event) =>
              setRescheduleReason(
                event.target.value,
              )
            }
            placeholder="Optional: explain why the appointment time is being changed..."
            className="mt-2 w-full resize-none rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
          />

          <span className="mt-1 block text-right text-xs font-semibold text-slate-400">
            {rescheduleReason.length}/1000
          </span>
        </label>

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
            type="submit"
            disabled={
              isSubmitting ||
              !canSubmit
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-5 text-sm font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]"
          >
            <LuCalendarClock className="size-4" />
            {isSubmitting
              ? "Rescheduling..."
              : "Confirm Reschedule"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default DoctorRescheduleModal;