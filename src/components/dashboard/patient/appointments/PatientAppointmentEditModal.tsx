"use client";

import { useEffect, useMemo, useState } from "react";
import { LuCalendarDays, LuClock3, LuHouse, LuPhone, LuStethoscope, LuUserRound } from "react-icons/lu";
import ModalShell from "./ModalShell";
import type { PatientAppointment, PatientAppointmentFormValues } from "./types";

interface Props {
  isOpen: boolean;
  appointment: PatientAppointment | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: PatientAppointmentFormValues) => Promise<void>;
}

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const emptyValues: PatientAppointmentFormValues = {
  patientName: "",
  phone: "",
  address: "",
  problemTitle: "",
  symptomsDescription: "",
  appointmentDate: "",
  appointmentTime: "",
};

const PatientAppointmentEditModal = ({ isOpen, appointment, isSubmitting, onClose, onSubmit }: Props) => {
  const [values, setValues] = useState(emptyValues);
  const today = useMemo(() => getToday(), []);

  useEffect(() => {
    if (!isOpen || !appointment) return;
    setValues({
      patientName: appointment.patientName,
      phone: appointment.phone,
      address: appointment.address,
      problemTitle: appointment.problemTitle,
      symptomsDescription: appointment.symptomsDescription,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
    });
  }, [isOpen, appointment]);

  if (!appointment) return null;

  const update = (field: keyof PatientAppointmentFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const valid = Boolean(
    values.patientName.trim() &&
      values.phone.trim() &&
      values.address.trim() &&
      values.problemTitle.trim() &&
      values.symptomsDescription.trim() &&
      values.appointmentDate >= today &&
      values.appointmentTime,
  );

  const inputClass = "h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white";

  return (
    <ModalShell
      isOpen={isOpen}
      title="Edit Appointment"
      description={`Update the information submitted for ${appointment.doctorName}.`}
      onClose={() => { if (!isSubmitting) onClose(); }}
      maxWidthClassName="max-w-3xl"
    >
      <form
        className="space-y-5 p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid) void onSubmit(values);
        }}
      >
        {appointment.status === "rejected" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
            Updating a rejected appointment will resubmit it with pending status.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-black text-slate-800 dark:text-white">
            Patient Name
            <div className="relative mt-2"><LuUserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required maxLength={150} value={values.patientName} onChange={(e) => update("patientName", e.target.value)} className={inputClass} /></div>
          </label>
          <label className="block text-sm font-black text-slate-800 dark:text-white">
            Phone Number
            <div className="relative mt-2"><LuPhone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required maxLength={40} value={values.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></div>
          </label>
        </div>

        <label className="block text-sm font-black text-slate-800 dark:text-white">
          Address
          <div className="relative mt-2"><LuHouse className="pointer-events-none absolute left-4 top-4 size-4 text-slate-400" /><textarea required rows={3} maxLength={500} value={values.address} onChange={(e) => update("address", e.target.value)} className="w-full resize-none rounded-2xl border border-[#E4D5E7] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white" /></div>
        </label>

        <label className="block text-sm font-black text-slate-800 dark:text-white">
          Health Problem Title
          <div className="relative mt-2"><LuStethoscope className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required maxLength={250} value={values.problemTitle} onChange={(e) => update("problemTitle", e.target.value)} className={inputClass} /></div>
        </label>

        <label className="block text-sm font-black text-slate-800 dark:text-white">
          Full Symptoms Description
          <textarea required rows={6} maxLength={5000} value={values.symptomsDescription} onChange={(e) => update("symptomsDescription", e.target.value)} className="mt-2 w-full resize-none rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm outline-none focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white" />
          <span className="mt-1 block text-right text-xs font-semibold text-slate-400">{values.symptomsDescription.length}/5000</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-black text-slate-800 dark:text-white">
            Appointment Date
            <div className="relative mt-2"><LuCalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="date" required min={today} value={values.appointmentDate} onChange={(e) => update("appointmentDate", e.target.value)} className={inputClass} /></div>
          </label>
          <label className="block text-sm font-black text-slate-800 dark:text-white">
            Appointment Time
            <div className="relative mt-2"><LuClock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="time" required value={values.appointmentTime} onChange={(e) => update("appointmentTime", e.target.value)} className={inputClass} /></div>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#F5CBCB] pt-5 dark:border-[#41354A] sm:flex-row sm:justify-end">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-black text-slate-700 disabled:opacity-50 dark:border-[#5D4C69] dark:text-white">Cancel</button>
          <button type="submit" disabled={isSubmitting || !valid} className="h-11 rounded-xl bg-[#745D83] px-5 text-sm font-black text-white hover:bg-[#614E70] disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]">
            {isSubmitting ? "Updating..." : appointment.status === "rejected" ? "Update & Resubmit" : "Update Appointment"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default PatientAppointmentEditModal;