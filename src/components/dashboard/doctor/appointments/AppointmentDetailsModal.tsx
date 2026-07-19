"use client";

import {
  LuCalendarDays,
  LuClock3,
  LuMail,
  LuPhone,
  LuStethoscope,
  LuUserRound,
} from "react-icons/lu";
import { LuHouse } from "react-icons/lu";

import ModalShell from "./ModalShell";

import type {
  DoctorAppointment,
} from "./types";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  appointment: DoctorAppointment | null;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  fullWidth?: boolean;
}

const DetailItem = ({
  label,
  value,
  icon: Icon,
  fullWidth = false,
}: DetailItemProps) => {
  return (
    <div
      className={`rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70 ${
        fullWidth
          ? "md:col-span-2"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#745D83] shadow-sm dark:bg-[#2A2233] dark:text-[#F5CBCB]">
          <Icon className="size-4" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">
            {label}
          </p>

          <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-slate-800 dark:text-[#E7DDE8]">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

const AppointmentDetailsModal = ({
  isOpen,
  appointment,
  isLoading,
  errorMessage,
  onClose,
}: AppointmentDetailsModalProps) => {
  const initial =
    appointment?.patientName
      .trim()
      .charAt(0)
      .toUpperCase() || "P";

  return (
    <ModalShell
      isOpen={isOpen}
      title="Patient Appointment Details"
      description="Complete information submitted by the patient."
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
    >
      <div className="p-5">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div className="size-9 animate-spin rounded-full border-4 border-[#C5B3D3] border-t-[#745D83]" />
          </div>
        ) : errorMessage && !appointment ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400">
            {errorMessage}
          </div>
        ) : appointment ? (
          <div className="space-y-5">
            {errorMessage && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
                {errorMessage}
              </div>
            )}

            <section className="flex flex-col gap-4 rounded-3xl border border-[#F5CBCB] bg-gradient-to-br from-[#FBEFEF] to-white p-5 dark:border-[#41354A] dark:from-[#352B3D] dark:to-[#2A2233] sm:flex-row sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#C5B3D3] bg-white text-3xl font-black text-[#745D83] dark:border-[#745D83] dark:bg-[#211B27] dark:text-[#F5CBCB]">
                {appointment.patientImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={appointment.patientImage}
                    alt={appointment.patientName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  initial
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                    {appointment.patientName}
                  </h3>

                  <span className="rounded-full border border-[#C5B3D3] bg-white px-3 py-1 text-xs font-black capitalize text-[#614E70] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB]">
                    {appointment.status === "completed"
                      ? "Complete Consultation"
                      : appointment.status}
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
                  {appointment.problemTitle}
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-[#CDBFD0]">
                  Applied on{" "}
                  {appointment.createdAt
                    ? new Date(
                        appointment.createdAt,
                      ).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <DetailItem
                icon={LuUserRound}
                label="Patient Name"
                value={appointment.patientName}
              />

              <DetailItem
                icon={LuMail}
                label="Email"
                value={appointment.patientEmail}
              />

              <DetailItem
                icon={LuPhone}
                label="Phone"
                value={appointment.phone}
              />

              <DetailItem
                icon={LuHouse}
                label="Address"
                value={appointment.address}
              />

              <DetailItem
                icon={LuStethoscope}
                label="Health Problem"
                value={appointment.problemTitle}
                fullWidth
              />

              <DetailItem
                icon={LuStethoscope}
                label="Symptoms Description"
                value={appointment.symptomsDescription}
                fullWidth
              />

              <DetailItem
                icon={LuCalendarDays}
                label="Appointment Date"
                value={appointment.appointmentDate}
              />

              <DetailItem
                icon={LuClock3}
                label="Appointment Time"
                value={appointment.appointmentTime}
              />

              {appointment.rejectionReason && (
                <DetailItem
                  icon={LuStethoscope}
                  label="Rejection Message"
                  value={appointment.rejectionReason}
                  fullWidth
                />
              )}

              {appointment.rescheduleReason && (
                <DetailItem
                  icon={LuCalendarDays}
                  label="Admin Reschedule Reason"
                  value={appointment.rescheduleReason}
                  fullWidth
                />
              )}
            </section>

            <div className="flex justify-end border-t border-[#F5CBCB] pt-5 dark:border-[#41354A]">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl bg-[#745D83] px-5 text-sm font-black text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27]"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
};

export default AppointmentDetailsModal;