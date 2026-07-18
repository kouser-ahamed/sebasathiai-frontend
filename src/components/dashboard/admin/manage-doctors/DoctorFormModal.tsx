"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { LuLoaderCircle, LuSave } from "react-icons/lu";

import ModalShell from "./ModalShell";
import type { Doctor, DoctorFormValues } from "./types";

interface DoctorFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  doctor: Doctor | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: DoctorFormValues) => Promise<void>;
}

const emptyValues: DoctorFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  qualification: "",
  experienceYears: "",
  hospital: "",
  address: "",
  bio: "",
  image: "",
};

const toFormValues = (doctor: Doctor | null): DoctorFormValues =>
  doctor
    ? {
        name: doctor.name,
        email: doctor.email,
        password: "",
        phone: doctor.phone,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experienceYears: String(doctor.experienceYears || ""),
        hospital: doctor.hospital,
        address: doctor.address,
        bio: doctor.bio,
        image: doctor.image || "",
      }
    : emptyValues;

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-[#E4D5E7] bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#745D83] focus:ring-4 focus:ring-[#C5B3D3]/25 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:focus:border-[#F5CBCB]";

const labelClass = "text-sm font-bold text-slate-700 dark:text-[#E7DDE8]";

const DoctorFormModal = ({
  isOpen,
  mode,
  doctor,
  isSubmitting,
  onClose,
  onSubmit,
}: DoctorFormModalProps) => {
  const [values, setValues] = useState<DoctorFormValues>(toFormValues(doctor));
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValues(toFormValues(doctor));
      setValidationError("");
    }
  }, [doctor, isOpen, mode]);

  const updateValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (
      !values.name.trim() ||
      !values.email.trim() ||
      !values.specialization.trim()
    ) {
      setValidationError("Name, email and specialization are required.");
      return;
    }

    if (mode === "create" && values.password.length < 8) {
      setValidationError(
        "Temporary password must contain at least 8 characters.",
      );
      return;
    }

    await onSubmit(values);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      title={mode === "create" ? "Add New Doctor" : "Edit Doctor"}
      description={
        mode === "create"
          ? "Create the doctor's login account and professional profile."
          : "Update the doctor's account and professional information."
      }
      sizeClassName="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        {validationError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
            {validationError}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Full Name *
            <input
              name="name"
              value={values.name}
              onChange={updateValue}
              placeholder="Dr. John Doe"
              className={inputClass}
              required
            />
          </label>

          <label className={labelClass}>
            Email Address *
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={updateValue}
              placeholder="doctor@example.com"
              className={inputClass}
              required
            />
          </label>

          {mode === "create" && (
            <label className={labelClass}>
              Temporary Password *
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={updateValue}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={inputClass}
                required
                minLength={8}
              />
            </label>
          )}

          <label className={labelClass}>
            Phone
            <input
              name="phone"
              value={values.phone}
              onChange={updateValue}
              placeholder="+8801XXXXXXXXX"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Specialization *
            <input
              name="specialization"
              value={values.specialization}
              onChange={updateValue}
              placeholder="Cardiology"
              className={inputClass}
              required
            />
          </label>

          <label className={labelClass}>
            Qualification
            <input
              name="qualification"
              value={values.qualification}
              onChange={updateValue}
              placeholder="MBBS, FCPS"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Experience (years)
            <input
              type="number"
              min="0"
              step="1"
              name="experienceYears"
              value={values.experienceYears}
              onChange={updateValue}
              placeholder="5"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Hospital
            <input
              name="hospital"
              value={values.hospital}
              onChange={updateValue}
              placeholder="Hospital name"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Profile Image URL
            <input
              type="url"
              name="image"
              value={values.image}
              onChange={updateValue}
              placeholder="https://..."
              className={inputClass}
            />
          </label>
        </div>

        <label className={labelClass}>
          Address
          <textarea
            name="address"
            value={values.address}
            onChange={updateValue}
            rows={3}
            className={`${inputClass} h-auto min-h-24 py-3`}
          />
        </label>

        <label className={labelClass}>
          Professional Bio
          <textarea
            name="bio"
            value={values.bio}
            onChange={updateValue}
            rows={4}
            className={`${inputClass} h-auto min-h-28 py-3`}
          />
        </label>

        <footer className="flex flex-col-reverse gap-3 border-t border-[#F5CBCB] pt-5 dark:border-[#41354A] sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 rounded-xl border border-[#E4D5E7] px-5 text-sm font-bold text-slate-700 transition hover:bg-[#FBEFEF] disabled:opacity-60 dark:border-[#5D4C69] dark:text-[#E7DDE8] dark:hover:bg-[#352B3D]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-5 text-sm font-bold text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C5B3D3] dark:text-[#211B27] dark:hover:bg-[#F5CBCB]"
          >
            {isSubmitting ? (
              <LuLoaderCircle className="size-4 animate-spin" />
            ) : (
              <LuSave className="size-4" />
            )}
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Doctor"
                : "Save Changes"}
          </button>
        </footer>
      </form>
    </ModalShell>
  );
};

export default DoctorFormModal;
