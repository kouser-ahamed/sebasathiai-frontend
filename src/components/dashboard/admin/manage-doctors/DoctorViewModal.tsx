"use client";

import {
  LuBriefcaseMedical,
  LuCalendarDays,
  LuCircleUserRound,
  LuClock3,
  LuGraduationCap,
  LuHospital,
  LuImage,
  LuLoaderCircle,
  LuMail,
  LuMapPin,
  LuPhone,
  LuShieldCheck,
  LuStethoscope,
} from "react-icons/lu";

import ModalShell from "./ModalShell";

import type { Doctor } from "./types";

interface DoctorViewModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  isLoading: boolean;
  errorMessage?: string;
  onClose: () => void;
}

interface InformationItemProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const formatDate = (value: string | null): string => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const InformationItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: InformationItemProps) => {
  return (
    <div
      className={`rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70 ${
        fullWidth ? "md:col-span-2" : ""
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

          <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800 dark:text-[#E7DDE8]">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

const DoctorViewModal = ({
  isOpen,
  doctor,
  isLoading,
  errorMessage = "",
  onClose,
}: DoctorViewModalProps) => {
  const initial = doctor?.name?.trim().charAt(0).toUpperCase() || "D";

  return (
    <ModalShell
      isOpen={isOpen}
      title="Doctor Details"
      description="Complete doctor account and professional information."
      onClose={onClose}
      sizeClassName="max-w-4xl"
    >
      <div className="p-5">
        {isLoading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3">
            <LuLoaderCircle className="size-8 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />

            <p className="text-sm font-semibold text-slate-500 dark:text-[#A997AE]">
              Loading doctor information...
            </p>
          </div>
        ) : errorMessage && !doctor ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400">
            {errorMessage}
          </div>
        ) : doctor ? (
          <div className="space-y-5">
            {errorMessage && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
                {errorMessage}
              </div>
            )}

            <section className="flex flex-col gap-4 rounded-3xl border border-[#F5CBCB] bg-gradient-to-br from-[#FBEFEF] to-white p-5 dark:border-[#41354A] dark:from-[#352B3D] dark:to-[#2A2233] sm:flex-row sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#C5B3D3] bg-white text-3xl font-black text-[#745D83] shadow-sm dark:border-[#745D83] dark:bg-[#211B27] dark:text-[#F5CBCB]">
                {doctor.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words text-2xl font-black text-slate-900 dark:text-white">
                    {doctor.name}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                      doctor.status === "active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400"
                        : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#745D83] dark:text-[#F5CBCB]">
                  <LuStethoscope className="size-4" />
                  {doctor.specialization || "Specialization not provided"}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#CDBFD0]">
                  {doctor.bio || "No professional biography has been provided."}
                </p>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <InformationItem
                icon={LuCircleUserRound}
                label="Doctor ID"
                value={doctor.id}
              />

              <InformationItem
                icon={LuShieldCheck}
                label="Linked User ID"
                value={doctor.userId || "Not available"}
              />

              <InformationItem
                icon={LuMail}
                label="Email"
                value={doctor.email}
              />

              <InformationItem
                icon={LuPhone}
                label="Phone"
                value={doctor.phone}
              />

              <InformationItem
                icon={LuStethoscope}
                label="Specialization"
                value={doctor.specialization}
              />

              <InformationItem
                icon={LuGraduationCap}
                label="Qualification"
                value={doctor.qualification}
              />

              <InformationItem
                icon={LuBriefcaseMedical}
                label="Experience"
                value={`${doctor.experienceYears} years`}
              />

              <InformationItem
                icon={LuHospital}
                label="Chamber"
                value={doctor.chamber}
              />

              <InformationItem
                icon={LuMapPin}
                label="Address"
                value={doctor.address}
                fullWidth
              />

              <InformationItem
                icon={LuImage}
                label="Profile Image URL"
                value={doctor.image || "No image"}
                fullWidth
              />

              <InformationItem
                icon={LuCalendarDays}
                label="Created At"
                value={formatDate(doctor.createdAt)}
              />

              <InformationItem
                icon={LuClock3}
                label="Last Updated"
                value={formatDate(doctor.updatedAt)}
              />
            </section>

            <div className="flex justify-end border-t border-[#F5CBCB] pt-5 dark:border-[#41354A]">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl bg-[#745D83] px-5 text-sm font-bold text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27] dark:hover:bg-[#F5CBCB]"
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

export default DoctorViewModal;
