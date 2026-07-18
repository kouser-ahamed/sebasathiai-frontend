"use client";

import { useMemo, useState } from "react";
import { LuPlus, LuRefreshCw, LuSearch, LuStethoscope } from "react-icons/lu";
import { Doctor, DoctorFormValues, DoctorStatus } from "./types";
import DoctorTable from "./DoctorTable";
import DoctorFormModal from "./DoctorFormModal";
import ConfirmActionModal from "./ConfirmActionModal";
import { createDoctor, deleteDoctor, fetchDoctorsClient, updateDoctor, updateDoctorStatus } from "./doctor-api";






interface ManageDoctorsProps {
  initialDoctors: Doctor[];
  initialError?: string;
  readOnly: boolean;
}

type StatusFilter = "all" | DoctorStatus;

const replaceDoctor = (doctors: Doctor[], updated: Doctor): Doctor[] =>
  doctors.map((doctor) => (doctor.id === updated.id ? updated : doctor));

const ManageDoctors = ({
  initialDoctors,
  initialError = "",
  readOnly,
}: ManageDoctorsProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [statusTarget, setStatusTarget] = useState<Doctor | null>(null);
  const [nextStatus, setNextStatus] = useState<DoctorStatus>("blocked");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialError);

  const clearFeedback = () => {
    setMessage("");
    setErrorMessage("");
  };

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesStatus =
        statusFilter === "all" || doctor.status === statusFilter;

      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query) ||
        doctor.phone.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [doctors, search, statusFilter]);

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "active",
  ).length;

  const openCreate = () => {
    if (readOnly) {
      setErrorMessage(
        "Your account is blocked. You can view data, but you cannot add doctors.",
      );
      return;
    }

    clearFeedback();
    setFormMode("create");
    setSelectedDoctor(null);
    setFormOpen(true);
  };

  const openEdit = (doctor: Doctor) => {
    if (readOnly) {
      setErrorMessage(
        "Your account is blocked. You can view data, but you cannot edit doctors.",
      );
      return;
    }

    clearFeedback();
    setFormMode("edit");
    setSelectedDoctor(doctor);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: DoctorFormValues) => {
    if (readOnly) {
      setErrorMessage("Your account is blocked. This action is not allowed.");
      return;
    }

    clearFeedback();
    setIsSubmitting(true);

    try {
      if (formMode === "edit" && selectedDoctor) {
        const response = await updateDoctor(selectedDoctor.id, values);
        setDoctors((previous) => replaceDoctor(previous, response.doctor));
        setMessage(response.message);
      } else {
        const response = await createDoctor(values);
        setDoctors((previous) => [response.doctor, ...previous]);
        setMessage(response.message);
      }

      setFormOpen(false);
      setSelectedDoctor(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Doctor could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget || readOnly) return;

    clearFeedback();
    setIsSubmitting(true);

    try {
      const response = await updateDoctorStatus(statusTarget.id, nextStatus);
      setDoctors((previous) => replaceDoctor(previous, response.doctor));
      setMessage(response.message);
      setStatusTarget(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Doctor status could not be changed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || readOnly) return;

    clearFeedback();
    setIsSubmitting(true);

    try {
      const response = await deleteDoctor(deleteTarget.id);
      setDoctors((previous) =>
        previous.filter((doctor) => doctor.id !== deleteTarget.id),
      );
      setMessage(response.message);
      setDeleteTarget(null);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Doctor could not be deleted.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    clearFeedback();
    setIsRefreshing(true);

    try {
      const response = await fetchDoctorsClient();
      setDoctors(response.doctors);
      setMessage("Doctor list refreshed successfully.");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Doctor list could not be loaded.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-[#F5CBCB] bg-gradient-to-br from-white via-[#FBEFEF] to-[#FFE2E2] p-5 shadow-sm dark:border-[#41354A] dark:from-[#2A2233] dark:via-[#352B3D] dark:to-[#2A2233] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5B3D3] bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#614E70] dark:border-[#745D83] dark:bg-[#211B27]/40 dark:text-[#F5CBCB]">
              <LuStethoscope className="size-4" /> Doctor Management
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              Manage Doctors
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#D8CADA]">
              Add, edit, activate, block or permanently delete doctor accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={readOnly}
            title={
              readOnly ? "Blocked accounts have read-only access" : "Add doctor"
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27] dark:hover:bg-[#F5CBCB]"
          >
            <LuPlus className="size-5" /> Add Doctor
          </button>
        </div>
      </header>

      {readOnly && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
          Your account is blocked. You can view and refresh doctor data, but
          add, edit, block, activate and delete actions are disabled.
        </div>
      )}

      {(message || errorMessage) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            errorMessage
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"
          }`}
        >
          {errorMessage || message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [
            "Total Doctors",
            doctors.length,
            "text-[#745D83] dark:text-[#F5CBCB]",
          ],
          [
            "Active Doctors",
            activeDoctors,
            "text-emerald-600 dark:text-emerald-400",
          ],
          [
            "Blocked Doctors",
            doctors.length - activeDoctors,
            "text-red-600 dark:text-red-400",
          ],
        ].map(([label, value, tone]) => (
          <article
            key={String(label)}
            className="rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233]"
          >
            <p className={`text-sm font-semibold ${String(tone)}`}>{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {value}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A83A8]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or specialization"
              className="h-11 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#C5B3D3]/25 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:focus:border-[#F5CBCB]"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-11 rounded-xl border border-[#E4D5E7] bg-white px-3 text-sm font-semibold text-slate-700 outline-none dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] px-4 text-sm font-bold text-[#614E70] transition hover:bg-[#FBEFEF] disabled:opacity-60 dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
          >
            <LuRefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <DoctorTable
        doctors={filteredDoctors}
        readOnly={readOnly}
        onEdit={openEdit}
        onDelete={(doctor) => {
          if (readOnly) {
            setErrorMessage(
              "Your account is blocked. You cannot delete doctors.",
            );
            return;
          }

          clearFeedback();
          setDeleteTarget(doctor);
        }}
        onStatusChange={(doctor, status) => {
          if (readOnly) {
            setErrorMessage(
              "Your account is blocked. You cannot change doctor status.",
            );
            return;
          }

          clearFeedback();
          setStatusTarget(doctor);
          setNextStatus(status);
        }}
      />

      <DoctorFormModal
        isOpen={formOpen}
        mode={formMode}
        doctor={selectedDoctor}
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setFormOpen(false);
            setSelectedDoctor(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmActionModal
        isOpen={Boolean(statusTarget)}
        title={nextStatus === "blocked" ? "Block Doctor" : "Activate Doctor"}
        description={
          nextStatus === "blocked"
            ? `Block ${statusTarget?.name || "this doctor"}? Existing sessions will be removed immediately.`
            : `Activate ${statusTarget?.name || "this doctor"}? The doctor will be allowed to access the dashboard again.`
        }
        confirmLabel={
          nextStatus === "blocked" ? "Block Doctor" : "Activate Doctor"
        }
        tone={nextStatus === "blocked" ? "warning" : "success"}
        isSubmitting={isSubmitting}
        onClose={() => !isSubmitting && setStatusTarget(null)}
        onConfirm={handleStatusConfirm}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Doctor"
        description={`Permanently delete ${deleteTarget?.name || "this doctor"}, including authentication account and sessions? This cannot be undone.`}
        confirmLabel="Delete Doctor"
        tone="danger"
        isSubmitting={isSubmitting}
        onClose={() => !isSubmitting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
};

export default ManageDoctors;
