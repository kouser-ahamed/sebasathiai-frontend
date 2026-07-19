"use client";

import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import {
  LuCalendarCheck,
  LuCheck,
  LuCircleAlert,
  LuLoaderCircle,
  LuRefreshCw,
  LuTrash2,
} from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

import AppointmentPagination from "./AppointmentPagination";
import CancelAppointmentModal from "./CancelAppointmentModal";
import PatientAppointmentDetailsModal from "./PatientAppointmentDetailsModal";
import PatientAppointmentEditModal from "./PatientAppointmentEditModal";
import PatientAppointmentTable from "./PatientAppointmentTable";

import {
  cancelPatientAppointment,
  fetchPatientAppointmentDetails,
  fetchPatientAppointments,
  updatePatientAppointment,
} from "./appointment-api";

import type {
  AppointmentDoctor,
  Pagination,
  PatientAppointment,
  PatientAppointmentFormValues,
  UserStatus,
} from "./types";

interface PatientAppointmentsProps {
  patientName?: string | null;
  userStatus: UserStatus;
}

const emptyPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

const PatientAppointments = ({
  patientName,
  userStatus,
}: PatientAppointmentsProps) => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);

  const [pagination, setPagination] = useState<Pagination>(emptyPagination);

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [viewOpen, setViewOpen] = useState(false);

  const [viewAppointment, setViewAppointment] =
    useState<PatientAppointment | null>(null);

  const [viewDoctor, setViewDoctor] = useState<AppointmentDoctor | null>(null);

  const [isViewing, setIsViewing] = useState(false);

  const [viewError, setViewError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  const [editAppointment, setEditAppointment] =
    useState<PatientAppointment | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);

  const [selectedCancelAppointment, setSelectedCancelAppointment] =
    useState<PatientAppointment | null>(null);

  const [isCancelling, setIsCancelling] = useState(false);

  const readOnly = userStatus === "blocked";

  const toastBase = {
    autoClose: 1000,
    hideProgressBar: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    closeOnClick: true,
  } as const;

  const showUpdateToast = (message: string) => {
    toast.success(message, {
      ...toastBase,

      style: {
        background: "#745D83",
        color: "#FFFFFF",
        fontWeight: 700,
      },

      icon: <LuCheck className="size-5 text-white" />,
    });
  };

  const showDeleteToast = (message: string) => {
    toast.error(message, {
      ...toastBase,

      style: {
        background: "#DC2626",
        color: "#FFFFFF",
        fontWeight: 700,
      },

      icon: <LuTrash2 className="size-5 text-white" />,
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      ...toastBase,

      style: {
        background: "#B91C1C",
        color: "#FFFFFF",
        fontWeight: 700,
      },

      icon: <LuCircleAlert className="size-5 text-white" />,
    });
  };

  const showInfoToast = (message: string) => {
    toast.info(message, {
      ...toastBase,

      style: {
        background: "#614E70",
        color: "#FFFFFF",
        fontWeight: 700,
      },

      icon: <LuRefreshCw className="size-5 text-white" />,
    });
  };

  const loadAppointments = useCallback(
    async (showRefreshToast = false) => {
      setIsLoading(true);

      try {
        const response = await fetchPatientAppointments(page);

        setAppointments(response.appointments);

        setPagination(response.pagination);

        if (showRefreshToast) {
          showInfoToast("Appointments refreshed successfully");
        }
      } catch (error: unknown) {
        showErrorToast(
          getErrorMessage(error, "Appointments could not be loaded."),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const openView = async (appointment: PatientAppointment): Promise<void> => {
    setViewOpen(true);
    setViewAppointment(appointment);
    setViewDoctor(null);
    setViewError("");
    setIsViewing(true);

    try {
      const response = await fetchPatientAppointmentDetails(appointment.id);

      setViewAppointment(response.appointment);

      setViewDoctor(response.doctor);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Appointment details could not be loaded.",
      );

      setViewError(message);

      showErrorToast(message);
    } finally {
      setIsViewing(false);
    }
  };

  const submitEdit = async (
    values: PatientAppointmentFormValues,
  ): Promise<void> => {
    if (!editAppointment || readOnly) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await updatePatientAppointment(
        editAppointment.id,
        values,
      );

      showUpdateToast(response.message);

      setEditOpen(false);
      setEditAppointment(null);

      await loadAppointments();
    } catch (error: unknown) {
      showErrorToast(
        getErrorMessage(error, "Appointment could not be updated."),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const submitCancel = async (): Promise<void> => {
    if (!selectedCancelAppointment || readOnly) {
      return;
    }

    setIsCancelling(true);

    try {
      const response = await cancelPatientAppointment(
        selectedCancelAppointment.id,
      );

      showDeleteToast(response.message);

      setCancelOpen(false);

      setSelectedCancelAppointment(null);

      if (appointments.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadAppointments();
      }
    } catch (error: unknown) {
      showErrorToast(
        getErrorMessage(error, "Appointment could not be cancelled."),
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <main className="space-y-5 sm:space-y-6">
      <header className="rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233] sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#745D83] dark:text-[#F5CBCB] sm:text-sm sm:tracking-[0.2em]">
              Patient Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              My Appointments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
              {patientName
                ? `${patientName}, view and manage your doctor appointments.`
                : "View and manage your doctor appointments."}
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => void loadAppointments(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] px-4 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D] sm:w-auto"
          >
            <LuRefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </header>

      {readOnly && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
          Your account is blocked. You can enter this page, view appointment
          details, refresh and use pagination, but edit and cancel actions are
          disabled.
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233] sm:rounded-3xl">
          <LuLoaderCircle className="size-9 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C5B3D3] bg-white p-8 text-center dark:border-[#5D4C69] dark:bg-[#2A2233] sm:rounded-3xl sm:p-12">
          <LuCalendarCheck className="mx-auto size-12 text-[#745D83] dark:text-[#F5CBCB]" />

          <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
            No appointments found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
            Your new doctor appointments will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <PatientAppointmentTable
            appointments={appointments}
            readOnly={readOnly}
            onView={(appointment) => void openView(appointment)}
            onEdit={(appointment) => {
              setEditAppointment(appointment);

              setEditOpen(true);
            }}
            onCancel={(appointment) => {
              setSelectedCancelAppointment(appointment);

              setCancelOpen(true);
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

      <PatientAppointmentDetailsModal
        isOpen={viewOpen}
        appointment={viewAppointment}
        doctor={viewDoctor}
        isLoading={isViewing}
        errorMessage={viewError}
        onClose={() => {
          setViewOpen(false);

          setViewAppointment(null);

          setViewDoctor(null);
          setViewError("");
        }}
      />

      <PatientAppointmentEditModal
        isOpen={editOpen}
        appointment={editAppointment}
        isSubmitting={isUpdating}
        onClose={() => {
          if (!isUpdating) {
            setEditOpen(false);

            setEditAppointment(null);
          }
        }}
        onSubmit={submitEdit}
      />

      <CancelAppointmentModal
        isOpen={cancelOpen}
        appointment={selectedCancelAppointment}
        isSubmitting={isCancelling}
        onClose={() => {
          if (!isCancelling) {
            setCancelOpen(false);

            setSelectedCancelAppointment(null);
          }
        }}
        onConfirm={submitCancel}
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
        limit={3}
      />
    </main>
  );
};

export default PatientAppointments;
