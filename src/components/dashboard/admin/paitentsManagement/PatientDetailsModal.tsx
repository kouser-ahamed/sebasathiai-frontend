"use client";

import { useEffect } from "react";
import {
  LuActivity,
  LuBriefcase,
  LuCalendarClock,
  LuCircleCheck,
  LuDroplet,
  LuEye,
  LuGlobe,
  LuLoaderCircle,
  LuMail,
  LuMapPin,
  LuPhone,
  LuShieldAlert,
  LuTrash2,
  LuUserRound,
  LuX,
} from "react-icons/lu";

import PatientAvatar from "./PatientAvatar";
import { AdminManagedPatient } from "./ index";


interface PatientDetailsModalProps {
  patient: AdminManagedPatient | null;
  isLoading: boolean;
  isActionBusy: boolean;
  onClose: () => void;
  onStatusAction: (patient: AdminManagedPatient) => void;
  onDeleteAction: (patient: AdminManagedPatient) => void;
}

const formatDate = (value: string | null): string => {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const InfoItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: typeof LuUserRound;
}) => (
  <div className="min-w-0 rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233]">
    <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">
      <Icon className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-bold leading-6 text-slate-800 [overflow-wrap:anywhere] dark:text-white">
      {value || "Not provided"}
    </p>
  </div>
);

const PatientDetailsModal = ({
  patient,
  isLoading,
  isActionBusy,
  onClose,
  onStatusAction,
  onDeleteAction,
}: PatientDetailsModalProps) => {
  useEffect(() => {
    if (!patient && !isLoading) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isActionBusy) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [patient, isLoading, isActionBusy, onClose]);

  if (!patient && !isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isActionBusy) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92dvh] w-full max-w-4xl min-w-0 flex-col overflow-hidden rounded-3xl border border-[#F5CBCB] bg-[#FFFDFD] shadow-2xl dark:border-[#41354A] dark:bg-[#211B27]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#F5CBCB] p-4 dark:border-[#41354A] sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <LuEye className="size-5" />
            </span>
            <div className="min-w-0">
              <h2
                id="patient-details-title"
                className="truncate text-lg font-black text-slate-950 dark:text-white sm:text-xl"
              >
                Patient Details
              </h2>
              <p className="text-xs font-semibold text-slate-400">
                Complete safe profile information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActionBusy}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] hover:text-slate-700 disabled:opacity-50 dark:hover:bg-[#352B3D] dark:hover:text-white"
            aria-label="Close patient details"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading || !patient ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <LuLoaderCircle className="size-8 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
              <p className="mt-3 text-sm font-bold text-slate-500 dark:text-[#A997AE]">
                Loading patient details...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="flex flex-col gap-4 rounded-3xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233] sm:flex-row sm:items-center sm:p-5">
                <PatientAvatar patient={patient} size="lg" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-xl font-black text-slate-950 [overflow-wrap:anywhere] dark:text-white sm:text-2xl">
                      {patient.name || "Unnamed patient"}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
                        patient.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-500 dark:text-[#BFAFC3]">
                    {patient.email}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                    {patient.emailVerified ? (
                      <LuCircleCheck className="size-4 text-emerald-600" />
                    ) : (
                      <LuShieldAlert className="size-4 text-amber-600" />
                    )}
                    Email {patient.emailVerified ? "verified" : "not verified"}
                  </p>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem label="Account ID" value={patient.id} icon={LuShieldAlert} />
                <InfoItem label="Role" value={patient.role} icon={LuUserRound} />
                <InfoItem label="Full name" value={patient.name} icon={LuUserRound} />
                <InfoItem label="Email" value={patient.email} icon={LuMail} />
                <InfoItem label="Phone" value={patient.phone} icon={LuPhone} />
                <InfoItem label="Gender" value={patient.gender} icon={LuUserRound} />
                <InfoItem label="Date of birth" value={patient.dateOfBirth} icon={LuCalendarClock} />
                <InfoItem label="Blood group" value={patient.bloodGroup} icon={LuDroplet} />
                <InfoItem label="Occupation" value={patient.occupation} icon={LuBriefcase} />
                <InfoItem label="City" value={patient.city} icon={LuMapPin} />
                <InfoItem label="Country" value={patient.country} icon={LuGlobe} />
                <InfoItem label="Address" value={patient.address} icon={LuMapPin} />
                <InfoItem label="Emergency contact" value={patient.emergencyContactName} icon={LuActivity} />
                <InfoItem label="Emergency phone" value={patient.emergencyContactPhone} icon={LuPhone} />
                <InfoItem label="Account created" value={formatDate(patient.createdAt)} icon={LuCalendarClock} />
                <InfoItem label="Last updated" value={formatDate(patient.updatedAt)} icon={LuCalendarClock} />
              </section>

              <section className="rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233]">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">
                  Bio / Additional information
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-slate-700 [overflow-wrap:anywhere] dark:text-[#E7DDE8]">
                  {patient.bio || "No additional information provided."}
                </p>
              </section>
            </div>
          )}
        </div>

        {patient && !isLoading && (
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#F5CBCB] p-4 dark:border-[#41354A] sm:flex-row sm:justify-end sm:p-5">
            <button
              type="button"
              onClick={() => onDeleteAction(patient)}
              disabled={isActionBusy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:bg-[#2A2233] dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LuTrash2 className="size-4" />
              Delete Patient
            </button>

            <button
              type="button"
              onClick={() => onStatusAction(patient)}
              disabled={isActionBusy}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black transition disabled:opacity-50 ${
                patient.status === "active"
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {patient.status === "active" ? (
                <LuShieldAlert className="size-4" />
              ) : (
                <LuCircleCheck className="size-4" />
              )}
              {patient.status === "active" ? "Block Patient" : "Unblock Patient"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsModal;