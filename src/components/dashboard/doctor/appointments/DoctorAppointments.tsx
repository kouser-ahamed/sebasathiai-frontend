"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  LuCalendarDays,
  LuLoaderCircle,
} from "react-icons/lu";

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

const DoctorAppointments = ({
  doctorName,
  userStatus,
}: DoctorAppointmentsProps) => {
  const [appointments, setAppointments] =
    useState<DoctorAppointment[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(emptyPagination);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] =
    useState("");
  const [status, setStatus] =
    useState<AppointmentStatus | "">("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [viewOpen, setViewOpen] =
    useState(false);
  const [viewAppointment, setViewAppointment] =
    useState<DoctorAppointment | null>(null);
  const [isViewing, setIsViewing] =
    useState(false);
  const [viewError, setViewError] =
    useState("");

  const [actionOpen, setActionOpen] =
    useState(false);
  const [actionAppointment, setActionAppointment] =
    useState<DoctorAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [rescheduleOpen, setRescheduleOpen] =
    useState(false);

  const [
    rescheduleAppointment,
    setRescheduleAppointment,
  ] = useState<DoctorAppointment | null>(
    null,
  );

  const [
    isRescheduling,
    setIsRescheduling,
  ] = useState(false);

  const readOnly =
    userStatus === "blocked";

  const loadAppointments =
    useCallback(async () => {
      setIsLoading(true);

      try {
        const response =
          await fetchDoctorAppointments(
            page,
            status,
            submittedSearch,
          );

        setAppointments(
          response.appointments,
        );
        setPagination(
          response.pagination,
        );
      } catch (error: unknown) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Appointments could not be loaded.",
        });
      } finally {
        setIsLoading(false);
      }
    }, [page, status, submittedSearch]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const openView = async (
    appointment: DoctorAppointment,
  ) => {
    setViewOpen(true);
    setViewAppointment(appointment);
    setViewError("");
    setIsViewing(true);

    try {
      const response =
        await fetchDoctorAppointmentDetails(
          appointment.id,
        );

      setViewAppointment(
        response.appointment,
      );
    } catch (error: unknown) {
      setViewError(
        error instanceof Error
          ? error.message
          : "Appointment details could not be loaded.",
      );
    } finally {
      setIsViewing(false);
    }
  };

  const submitStatus = async (
    nextStatus: Exclude<
      AppointmentStatus,
      "pending"
    >,
    rejectionReason = "",
  ) => {
    if (!actionAppointment || readOnly) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response =
        await updateDoctorAppointmentStatus(
          actionAppointment.id,
          nextStatus,
          rejectionReason,
        );

      setFeedback({
        type: "success",
        message: response.message,
      });

      setActionOpen(false);
      setActionAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Appointment could not be updated.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReschedule = async (
    appointmentDate: string,
    appointmentTime: string,
    rescheduleReason: string,
  ) => {
    if (
      !rescheduleAppointment ||
      readOnly
    ) {
      return;
    }

    setIsRescheduling(true);
    setFeedback(null);

    try {
      const response =
        await rescheduleDoctorAppointment(
          rescheduleAppointment.id,
          appointmentDate,
          appointmentTime,
          rescheduleReason,
        );

      setFeedback({
        type: "success",
        message: response.message,
      });

      setRescheduleOpen(false);
      setRescheduleAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Appointment could not be rescheduled.",
      });
    } finally {
      setIsRescheduling(false);
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
            ? `${doctorName}, review new patient requests, approve or reject appointments, and complete consultations.`
            : "Review new patient requests, approve or reject appointments, and complete consultations."}
        </p>
      </header>

      {readOnly && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
          Your account is blocked. You can search,
          filter and view appointment data, but
          appointment actions are disabled.
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400"
          }`}
        >
          {feedback.message}
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
        onRefresh={() =>
          void loadAppointments()
        }
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
            New appointment requests will appear
            here automatically.
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
          setRescheduleAppointment(
            appointment,
          );
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
    </main>
  );
};

export default DoctorAppointments;