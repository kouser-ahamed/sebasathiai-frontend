"use client";

import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import { LuCalendarDays, LuLoaderCircle } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

import AppointmentActionModal from "./AppointmentActionModal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentPagination from "./AppointmentPagination";
import AppointmentTable from "./AppointmentTable";
import DoctorRescheduleModal from "./DoctorRescheduleModal";

import {
  fetchDoctorAppointmentDetails,
  fetchDoctorAppointments,
  rescheduleDoctorAppointment,
  updateDoctorAppointmentStatus,
} from "./appointment-api";

import type {
  AppointmentStatus,
  DoctorAppointment,
  Pagination,
  UserStatus,
} from "./types";
import CompleteConsultationModal from "./CompleteConsultationModal";

interface DoctorAppointmentsProps {
  doctorName?: string | null;
  userStatus: UserStatus;
}

const emptyPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
};

const DoctorAppointments = ({
  doctorName,
  userStatus,
}: DoctorAppointmentsProps) => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);

  const [pagination, setPagination] = useState<Pagination>(emptyPagination);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [submittedSearch, setSubmittedSearch] = useState("");

  const [status, setStatus] = useState<AppointmentStatus | "">("");

  const [isLoading, setIsLoading] = useState(true);

  const [viewOpen, setViewOpen] = useState(false);

  const [viewAppointment, setViewAppointment] =
    useState<DoctorAppointment | null>(null);

  const [isViewing, setIsViewing] = useState(false);

  const [viewError, setViewError] = useState("");

  const [actionOpen, setActionOpen] = useState(false);

  const [actionAppointment, setActionAppointment] =
    useState<DoctorAppointment | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<DoctorAppointment | null>(null);

  const [isRescheduling, setIsRescheduling] = useState(false);

  const [completeOpen, setCompleteOpen] = useState(false);

  const [completeAppointment, setCompleteAppointment] =
    useState<DoctorAppointment | null>(null);

  const [isCompleting, setIsCompleting] = useState(false);

  const readOnly = userStatus === "blocked";

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetchDoctorAppointments(
        page,
        status,
        submittedSearch,
      );

      setAppointments(response.appointments);

      setPagination(response.pagination);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Appointments could not be loaded."));
    } finally {
      setIsLoading(false);
    }
  }, [page, status, submittedSearch]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const openView = async (appointment: DoctorAppointment): Promise<void> => {
    setViewOpen(true);
    setViewAppointment(appointment);
    setViewError("");
    setIsViewing(true);

    try {
      const response = await fetchDoctorAppointmentDetails(appointment.id);

      setViewAppointment(response.appointment);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Appointment details could not be loaded.",
      );

      setViewError(message);
      toast.error(message);
    } finally {
      setIsViewing(false);
    }
  };

  const submitStatus = async (
    nextStatus: Exclude<AppointmentStatus, "pending">,
    rejectionReason = "",
  ): Promise<void> => {
    if (!actionAppointment || readOnly) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateDoctorAppointmentStatus(
        actionAppointment.id,
        nextStatus,
        rejectionReason,
      );

      toast.success(response.message);

      setActionOpen(false);
      setActionAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Appointment could not be updated."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReschedule = async (
    appointmentDate: string,
    appointmentTime: string,
    rescheduleReason: string,
  ): Promise<void> => {
    if (!rescheduleAppointment || readOnly) {
      return;
    }

    setIsRescheduling(true);

    try {
      const response = await rescheduleDoctorAppointment(
        rescheduleAppointment.id,
        appointmentDate,
        appointmentTime,
        rescheduleReason,
      );

      toast.success(response.message);

      setRescheduleOpen(false);
      setRescheduleAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Appointment could not be rescheduled."),
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  const submitComplete = async (): Promise<void> => {
    if (!completeAppointment || readOnly) {
      return;
    }

    setIsCompleting(true);

    try {
      const response = await updateDoctorAppointmentStatus(
        completeAppointment.id,
        "completed",
      );

      toast.success(response.message);

      setCompleteOpen(false);
      setCompleteAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Consultation could not be completed."),
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="rounded-3xl border border-[#F5CBCB] bg-white p-6 dark:border-[#41354A] dark:bg-[#2A2233]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#745D83] dark:text-[#F5CBCB]">
          Doctor Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Patient Appointments
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
          {doctorName
            ? `${doctorName}, review new patient requests, approve or reject appointments, reschedule visits, and complete consultations.`
            : "Review new patient requests, approve or reject appointments, reschedule visits, and complete consultations."}
        </p>
      </header>

      {readOnly && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
          Your account is blocked. You can search, filter, paginate and view
          patient appointment information, but every appointment action is
          disabled.
        </div>
      )}

      <AppointmentFilters
        search={search}
        status={status}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onSearchSubmit={() => {
          setPage(1);
          setSubmittedSearch(search);
        }}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
        onRefresh={() => void loadAppointments()}
      />

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-3xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233]">
          <LuLoaderCircle className="size-9 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#C5B3D3] bg-white p-12 text-center dark:border-[#5D4C69] dark:bg-[#2A2233]">
          <LuCalendarDays className="mx-auto size-12 text-[#745D83] dark:text-[#F5CBCB]" />

          <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
            No appointments found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-[#A997AE]">
            New appointment requests will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <AppointmentTable
            appointments={appointments}
            readOnly={readOnly}
            onView={(appointment) => {
              void openView(appointment);
            }}
            onManage={(appointment) => {
              setActionAppointment(appointment);

              setActionOpen(true);
            }}
            onComplete={(appointment) => {
              setCompleteAppointment(appointment);

              setCompleteOpen(true);
            }}
          />

          <AppointmentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}

      <AppointmentDetailsModal
        isOpen={viewOpen}
        appointment={viewAppointment}
        isLoading={isViewing}
        errorMessage={viewError}
        onClose={() => {
          setViewOpen(false);
          setViewAppointment(null);
          setViewError("");
        }}
      />

      <AppointmentActionModal
        isOpen={actionOpen}
        appointment={actionAppointment}
        isSubmitting={isSubmitting}
        onClose={() => {
          setActionOpen(false);
          setActionAppointment(null);
        }}
        onOpenReschedule={(appointment) => {
          setActionOpen(false);
          setActionAppointment(null);

          setRescheduleAppointment(appointment);

          setRescheduleOpen(true);
        }}
        onSubmit={submitStatus}
      />

      <DoctorRescheduleModal
        isOpen={rescheduleOpen}
        appointment={rescheduleAppointment}
        isSubmitting={isRescheduling}
        onClose={() => {
          if (!isRescheduling) {
            setRescheduleOpen(false);
            setRescheduleAppointment(null);
          }
        }}
        onSubmit={submitReschedule}
      />

      <CompleteConsultationModal
        isOpen={completeOpen}
        appointment={completeAppointment}
        isSubmitting={isCompleting}
        onClose={() => {
          if (!isCompleting) {
            setCompleteOpen(false);
            setCompleteAppointment(null);
          }
        }}
        onConfirm={submitComplete}
      />

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        theme="colored"
      />
    </main>
  );
};

export default DoctorAppointments;
