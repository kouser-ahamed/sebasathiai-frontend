"use client";

import type { ComponentType } from "react";
import {
  LuBadgeCheck,
  LuBriefcaseMedical,
  LuCalendarDays,
  LuClock3,
  LuGraduationCap,
  LuHospital,
  LuMail,
  LuMapPin,
  LuPhone,
  LuStar,
  LuStethoscope,
  LuUserRound,
} from "react-icons/lu";

import ModalShell from "./ModalShell";
import StatusBadge from "./StatusBadge";
import type { AppointmentDoctor, PatientAppointment } from "./types";

interface Props {
  isOpen: boolean;
  appointment: PatientAppointment | null;
  doctor: AppointmentDoctor | null;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
}

interface DetailItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const DetailItem = ({ icon: Icon, label, value, fullWidth = false }: DetailItemProps) => (
  <div className={`rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70 ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#745D83] shadow-sm dark:bg-[#2A2233] dark:text-[#F5CBCB]">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">{label}</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-slate-800 dark:text-[#E7DDE8]">{value || "Not provided"}</p>
      </div>
    </div>
  </div>
);

const PatientAppointmentDetailsModal = ({
  isOpen,
  appointment,
  doctor,
  isLoading,
  errorMessage,
  onClose,
}: Props) => {
  const doctorName = doctor?.name || appointment?.doctorName || "Doctor";
  const doctorImage = doctor?.image || appointment?.doctorImage || null;
  const initial = doctorName.trim().charAt(0).toUpperCase() || "D";

  return (
    <ModalShell
      isOpen={isOpen}
      title="Appointment Details"
      description="Your submitted appointment information and complete doctor profile."
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
    >
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div className="size-9 animate-spin rounded-full border-4 border-[#C5B3D3] border-t-[#745D83]" />
          </div>
        ) : errorMessage && !appointment ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400">{errorMessage}</div>
        ) : appointment ? (
          <div className="space-y-6">
            {errorMessage && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">{errorMessage}</div>
            )}

            <section className="flex flex-col gap-4 rounded-3xl border border-[#F5CBCB] bg-gradient-to-br from-[#FBEFEF] to-white p-4 dark:border-[#41354A] dark:from-[#352B3D] dark:to-[#2A2233] sm:flex-row sm:items-center sm:p-5">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#C5B3D3] bg-white text-3xl font-black text-[#745D83] dark:border-[#745D83] dark:bg-[#211B27] dark:text-[#F5CBCB]">
                {doctorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doctorImage} alt={doctorName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : initial}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white">{doctorName}</h3>
                  <StatusBadge status={appointment.status} />
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm font-black text-[#745D83] dark:text-[#F5CBCB]">
                  <LuStethoscope className="size-4" />
                  {doctor?.specialization || appointment.specialization}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#CDBFD0]">{doctor?.bio || "Doctor biography is not available."}</p>
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-lg font-black text-slate-950 dark:text-white">Doctor Information</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem icon={LuGraduationCap} label="Qualification" value={doctor?.qualification || "Not available"} />
                <DetailItem icon={LuBriefcaseMedical} label="Experience" value={doctor ? `${doctor.experienceYears} years` : "Not available"} />
                <DetailItem icon={LuHospital} label="Hospital" value={doctor?.hospital || appointment.hospital} />
                <DetailItem icon={LuMail} label="Doctor Email" value={doctor?.email || "Not available"} />
                <DetailItem icon={LuPhone} label="Doctor Phone" value={doctor?.phone || "Not available"} />
                <DetailItem icon={LuMapPin} label="Doctor Address" value={doctor?.address || "Not available"} />
                <DetailItem icon={LuStar} label="Rating" value={doctor ? `${doctor.ratingAverage.toFixed(1)} / 5 (${doctor.ratingCount} reviews)` : "Not available"} fullWidth />
              </div>
            </section>

            <section>
              <h4 className="mb-3 text-lg font-black text-slate-950 dark:text-white">Your Submitted Information</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem icon={LuUserRound} label="Patient Name" value={appointment.patientName} />
                <DetailItem icon={LuMail} label="Patient Email" value={appointment.patientEmail} />
                <DetailItem icon={LuPhone} label="Phone" value={appointment.phone} />
                <DetailItem icon={LuMapPin} label="Address" value={appointment.address} />
                <DetailItem icon={LuBadgeCheck} label="Health Problem" value={appointment.problemTitle} fullWidth />
                <DetailItem icon={LuStethoscope} label="Symptoms Description" value={appointment.symptomsDescription} fullWidth />
                <DetailItem icon={LuCalendarDays} label="Appointment Date" value={appointment.appointmentDate} />
                <DetailItem icon={LuClock3} label="Appointment Time" value={appointment.appointmentTime} />
                {appointment.rejectionReason && <DetailItem icon={LuBadgeCheck} label="Rejection Message" value={appointment.rejectionReason} fullWidth />}
                {appointment.rescheduleReason && <DetailItem icon={LuCalendarDays} label="Reschedule Reason" value={appointment.rescheduleReason} fullWidth />}
              </div>
            </section>

            <div className="flex justify-end border-t border-[#F5CBCB] pt-5 dark:border-[#41354A]">
              <button type="button" onClick={onClose} className="h-11 w-full rounded-xl bg-[#745D83] px-5 text-sm font-black text-white hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27] sm:w-auto">Close</button>
            </div>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
};

export default PatientAppointmentDetailsModal;