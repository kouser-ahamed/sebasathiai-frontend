"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LuBan,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuEye,
  LuLoaderCircle,
  LuMail,
  LuRefreshCw,
  LuSearch,
  LuShieldCheck,
  LuTrash2,
  LuUsersRound,
  LuX,
} from "react-icons/lu";
import { AdminManagedPatient, AdminPatientsPagination, deleteAdminPatient, fetchAdminPatient, fetchAdminPatients, PatientAvatar, PatientDeleteModal, PatientDetailsModal, PatientManagementToast, PatientStatusFilter, PatientStatusModal, updateAdminPatientStatus } from "./ index";





const emptyPagination: AdminPatientsPagination = {
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

const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  const maximumButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maximumButtons / 2));
  let end = Math.min(totalPages, start + maximumButtons - 1);

  start = Math.max(1, end - maximumButtons + 1);

  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

const formatDate = (value: string | null): string => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const PatientsManagement = () => {
  const [patients, setPatients] = useState<AdminManagedPatient[]>([]);
  const [pagination, setPagination] =
    useState<AdminPatientsPagination>(emptyPagination);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PatientStatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewPatient, setViewPatient] =
    useState<AdminManagedPatient | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [statusPatient, setStatusPatient] =
    useState<AdminManagedPatient | null>(null);
  const [deletePatient, setDeletePatient] =
    useState<AdminManagedPatient | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<PatientManagementToast | null>(null);

  const showToast = useCallback(
    (type: PatientManagementToast["type"], message: string) => {
      setToast({
        id: Date.now(),
        type,
        message,
      });
    },
    [],
  );

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  const loadPatients = useCallback(
    async (showRefreshState = false) => {
      if (showRefreshState) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await fetchAdminPatients({
          page,
          search,
          status: statusFilter,
        });

        setPatients(response.patients);
        setPagination(response.pagination);

        if (response.pagination.page !== page) {
          setPage(response.pagination.page);
        }
      } catch (error: unknown) {
        showToast(
          "error",
          getErrorMessage(error, "Patients could not be loaded."),
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [page, search, statusFilter, showToast],
  );

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  const visiblePages = useMemo(
    () => getVisiblePages(pagination.page, pagination.totalPages),
    [pagination.page, pagination.totalPages],
  );

  const showingStart =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const showingEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  const openPatientDetails = async (patient: AdminManagedPatient) => {
    setViewPatient(patient);
    setIsViewLoading(true);

    try {
      const response = await fetchAdminPatient(patient.id);
      setViewPatient(response.patient);
    } catch (error: unknown) {
      showToast(
        "error",
        getErrorMessage(error, "Patient details could not be loaded."),
      );
      setViewPatient(null);
    } finally {
      setIsViewLoading(false);
    }
  };

  const confirmStatusChange = async (patient: AdminManagedPatient) => {
    setIsStatusUpdating(true);

    try {
      const nextStatus = patient.status === "active" ? "blocked" : "active";
      const response = await updateAdminPatientStatus(patient.id, nextStatus);

      setViewPatient((current) =>
        current?.id === response.patient.id ? response.patient : current,
      );
      setStatusPatient(null);
      showToast("success", response.message);
      await loadPatients(true);
    } catch (error: unknown) {
      showToast(
        "error",
        getErrorMessage(error, "Patient status could not be updated."),
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const confirmDeletePatient = async (patient: AdminManagedPatient) => {
    setIsDeleting(true);

    try {
      const response = await deleteAdminPatient(patient.id);
      const shouldMoveBack = patients.length === 1 && page > 1;

      setDeletePatient(null);
      setViewPatient((current) =>
        current?.id === patient.id ? null : current,
      );
      showToast("success", response.message);

      if (shouldMoveBack) {
        setPage((current) => Math.max(1, current - 1));
      } else {
        await loadPatients(true);
      }
    } catch (error: unknown) {
      showToast(
        "error",
        getErrorMessage(error, "Patient account could not be deleted."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openStatusFromDetails = (patient: AdminManagedPatient) => {
    setStatusPatient(patient);
  };

  const openDeleteFromDetails = (patient: AdminManagedPatient) => {
    setDeletePatient(patient);
  };

  return (
    <section className="min-w-0 space-y-5">
      {toast && (
        <div className="fixed right-3 top-20 z-[200] w-[calc(100%-1.5rem)] max-w-sm sm:right-5 sm:top-24">
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-[#C5B3D3] bg-[#745D83] text-white"
                : "border-red-300 bg-red-600 text-white"
            }`}
            role="status"
          >
            {toast.type === "success" ? (
              <LuCircleCheck className="mt-0.5 size-5 shrink-0" />
            ) : (
              <LuBan className="mt-0.5 size-5 shrink-0" />
            )}
            <p className="min-w-0 flex-1 break-words text-sm font-bold leading-6">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
              aria-label="Close notification"
            >
              <LuX className="size-4" />
            </button>
          </div>
        </div>
      )}

      <header className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white p-5 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <LuUsersRound className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#745D83] dark:text-[#F5CBCB]">
                Admin dashboard
              </p>
              <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
                Patient Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                Search patients, review profile information, control account access and remove patient accounts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FBEFEF] px-4 text-sm font-black text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <LuShieldCheck className="size-4" />
              {pagination.total} patients
            </span>

            <button
              type="button"
              onClick={() => void loadPatients(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#F5CBCB] bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
            >
              <LuRefreshCw
                className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block min-w-0">
            <span className="sr-only">Search patients by name or email</span>
            <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by patient name or email..."
              className="h-12 w-full rounded-2xl border border-[#F5CBCB] bg-[#FFFDFD] pl-11 pr-10 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#211B27] dark:text-white dark:focus:border-[#C5B3D3]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#FBEFEF] dark:hover:bg-[#352B3D]"
                aria-label="Clear search"
              >
                <LuX className="size-4" />
              </button>
            )}
          </label>

          <label className="min-w-0">
            <span className="sr-only">Filter patients by status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as PatientStatusFilter);
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-[#F5CBCB] bg-[#FFFDFD] px-4 text-sm font-black text-slate-700 outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#211B27] dark:text-white dark:focus:border-[#C5B3D3]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active patients</option>
              <option value="blocked">Blocked patients</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
        {isLoading ? (
          <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <LuLoaderCircle className="size-9 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
            <p className="mt-3 text-sm font-black text-slate-500 dark:text-[#A997AE]">
              Loading patients...
            </p>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <LuUsersRound className="size-8" />
            </span>
            <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
              No patients found
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
              Try another patient name, email address or account status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-[#FBEFEF] dark:bg-[#352B3D]">
                  <tr className="text-[11px] font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F5CBCB] dark:divide-[#41354A]">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="transition hover:bg-[#FFF9F9] dark:hover:bg-[#352B3D]/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <PatientAvatar patient={patient} size="sm" />
                          <div className="min-w-0">
                            <p className="max-w-64 truncate text-sm font-black text-slate-950 dark:text-white">
                              {patient.name || "Unnamed patient"}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                              Patient account
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="flex max-w-72 items-center gap-2 truncate text-sm font-semibold text-slate-600 dark:text-[#CDBFD0]">
                          <LuMail className="size-4 shrink-0 text-slate-400" />
                          <span className="truncate">{patient.email}</span>
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black capitalize ${
                            patient.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          }`}
                        >
                          {patient.status === "active" ? (
                            <LuCircleCheck className="size-3.5" />
                          ) : (
                            <LuBan className="size-3.5" />
                          )}
                          {patient.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-500 dark:text-[#A997AE]">
                        {formatDate(patient.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void openPatientDetails(patient)}
                            className="flex size-9 items-center justify-center rounded-xl bg-[#FBEFEF] text-[#745D83] transition hover:bg-[#F5CBCB] dark:bg-[#352B3D] dark:text-[#F5CBCB] dark:hover:bg-[#41354A]"
                            aria-label={`View ${patient.name || patient.email}`}
                            title="View patient"
                          >
                            <LuEye className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatusPatient(patient)}
                            className={`flex size-9 items-center justify-center rounded-xl transition ${
                              patient.status === "active"
                                ? "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300"
                            }`}
                            aria-label={`${patient.status === "active" ? "Block" : "Unblock"} ${patient.name || patient.email}`}
                            title={patient.status === "active" ? "Block patient" : "Unblock patient"}
                          >
                            {patient.status === "active" ? (
                              <LuBan className="size-4" />
                            ) : (
                              <LuCircleCheck className="size-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletePatient(patient)}
                            className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                            aria-label={`Delete ${patient.name || patient.email}`}
                            title="Delete patient"
                          >
                            <LuTrash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-3 md:hidden">
              {patients.map((patient) => (
                <article
                  key={patient.id}
                  className="min-w-0 rounded-2xl border border-[#F5CBCB] bg-[#FFFDFD] p-4 dark:border-[#41354A] dark:bg-[#211B27]"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <PatientAvatar patient={patient} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h2 className="min-w-0 max-w-full truncate text-base font-black text-slate-950 dark:text-white">
                          {patient.name || "Unnamed patient"}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${
                            patient.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </div>
                      <p className="mt-1 break-all text-xs font-semibold text-slate-500 dark:text-[#A997AE]">
                        {patient.email}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold text-slate-400">
                        Joined {formatDate(patient.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => void openPatientDetails(patient)}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FBEFEF] text-xs font-black text-[#745D83] transition hover:bg-[#F5CBCB] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                    >
                      <LuEye className="size-4" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatusPatient(patient)}
                      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition ${
                        patient.status === "active"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                      }`}
                    >
                      {patient.status === "active" ? (
                        <LuBan className="size-4" />
                      ) : (
                        <LuCircleCheck className="size-4" />
                      )}
                      {patient.status === "active" ? "Block" : "Unblock"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletePatient(patient)}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-red-50 text-xs font-black text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                    >
                      <LuTrash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!isLoading && pagination.total > 0 && (
          <footer className="flex flex-col gap-4 border-t border-[#F5CBCB] p-4 dark:border-[#41354A] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-slate-700 dark:text-white">
                Showing {showingStart}-{showingEnd} of {pagination.total} patients
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Page {pagination.page} of {pagination.totalPages} · 10 patients per page
              </p>
            </div>

            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Patient pagination"
            >
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={pagination.page <= 1}
                className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#F5CBCB] bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
              >
                <LuChevronLeft className="size-4" />
                Previous
              </button>

              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={
                    pageNumber === pagination.page ? "page" : undefined
                  }
                  className={`flex size-10 items-center justify-center rounded-xl text-sm font-black transition ${
                    pageNumber === pagination.page
                      ? "bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
                      : "border border-[#F5CBCB] bg-white text-slate-700 hover:bg-[#FBEFEF] dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1),
                  )
                }
                disabled={pagination.page >= pagination.totalPages}
                className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#F5CBCB] bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A]"
              >
                Next
                <LuChevronRight className="size-4" />
              </button>
            </nav>
          </footer>
        )}
      </div>

      <PatientDetailsModal
        patient={viewPatient}
        isLoading={isViewLoading}
        isActionBusy={isStatusUpdating || isDeleting}
        onClose={() => {
          if (!isStatusUpdating && !isDeleting) {
            setViewPatient(null);
          }
        }}
        onStatusAction={openStatusFromDetails}
        onDeleteAction={openDeleteFromDetails}
      />

      <PatientStatusModal
        patient={statusPatient}
        isSubmitting={isStatusUpdating}
        onClose={() => {
          if (!isStatusUpdating) {
            setStatusPatient(null);
          }
        }}
        onConfirm={(patient) => void confirmStatusChange(patient)}
      />

      <PatientDeleteModal
        patient={deletePatient}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setDeletePatient(null);
          }
        }}
        onConfirm={(patient) => void confirmDeletePatient(patient)}
      />
    </section>
  );
};

export default PatientsManagement;
