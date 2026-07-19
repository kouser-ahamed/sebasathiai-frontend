"use client";

import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import {
  LuCalendarClock,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuFileHeart,
  LuLoaderCircle,
  LuLockKeyhole,
  LuMessageSquareText,
  LuRefreshCw,
  LuTrash2,
  LuTriangleAlert,
  LuUserRound,
} from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import { PatientAIHealthAccount, PatientAIHealthHistory, PatientAIHealthPagination, PatientAIHealthUrgency } from "./ types";
import { deletePatientAIHealthHistory, fetchPatientAIHealthHistories, fetchPatientAIHealthHistory } from "./patient-ai-health-history-api";
import AIHealthHistoryDeleteModal from "./ AIHealthHistoryDeleteModal";
import AIHealthHistoryViewModal from "./AIHealthHistoryViewModal";





const PAGE_SIZE = 10;

const emptyPagination: PatientAIHealthPagination = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

const urgencyClasses: Record<PatientAIHealthUrgency, string> = {
  routine:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  soon: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  urgent:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  emergency: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1400,
    hideProgressBar: true,
    icon: <LuCheck className="size-5 text-white" />,
    style: {
      background: "#745D83",
      color: "#FFFFFF",
      fontWeight: 700,
    },
  });
};

const showError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 2200,
    hideProgressBar: true,
    icon: <LuTriangleAlert className="size-5 text-white" />,
    style: {
      background: "#B91C1C",
      color: "#FFFFFF",
      fontWeight: 700,
    },
  });
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getHistoryTitle = (history: PatientAIHealthHistory): string =>
  history.conversationTitle ||
  history.report.reportTitle ||
  "AI Health Summary";

const getHistoryMessage = (history: PatientAIHealthHistory): string =>
  history.report.conciseSummary || "No summary message is available.";

const getVisiblePageNumbers = (
  currentPage: number,
  totalPages: number,
): number[] => {
  const maximumVisiblePages = 5;

  if (totalPages <= maximumVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maximumVisiblePages / 2),
  );
  let endPage = startPage + maximumVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - maximumVisiblePages + 1;
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
};

const PatientAiHealthHistory = () => {
  const [histories, setHistories] = useState<PatientAIHealthHistory[]>([]);
  const [account, setAccount] = useState<PatientAIHealthAccount | null>(null);
  const [canDelete, setCanDelete] = useState(false);
  const [pagination, setPagination] =
    useState<PatientAIHealthPagination>(emptyPagination);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewHistory, setViewHistory] =
    useState<PatientAIHealthHistory | null>(null);
  const [deleteHistory, setDeleteHistory] =
    useState<PatientAIHealthHistory | null>(null);

  const loadHistories = useCallback(
    async (targetPage: number, refresh = false) => {
      refresh ? setIsRefreshing(true) : setIsLoading(true);

      try {
        const response = await fetchPatientAIHealthHistories(
          targetPage,
          PAGE_SIZE,
        );

        setHistories(response.histories);
        setAccount(response.account);
        setCanDelete(response.canDelete);
        setPagination(response.pagination);
        setPage(response.pagination.page);
      } catch (error: unknown) {
        showError(
          getErrorMessage(
            error,
            "Your AI health history could not be loaded.",
          ),
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadHistories(page);
  }, [loadHistories, page]);

  const handleView = async (history: PatientAIHealthHistory) => {
    if (isViewing) return;

    setIsViewing(true);

    try {
      const response = await fetchPatientAIHealthHistory(history.id);
      setViewHistory(response.history);
      setAccount(response.account);
      setCanDelete(response.canDelete);
    } catch (error: unknown) {
      showError(
        getErrorMessage(
          error,
          "The selected AI health history could not be opened.",
        ),
      );
    } finally {
      setIsViewing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteHistory || !canDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await deletePatientAIHealthHistory(deleteHistory.id);
      setDeleteHistory(null);
      showSuccess(response.message);

      const nextPage =
        histories.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadHistories(nextPage, true);
      }
    } catch (error: unknown) {
      showError(
        getErrorMessage(
          error,
          "The selected AI health history could not be deleted.",
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const firstVisibleItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const lastVisibleItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );
  const visiblePageNumbers = getVisiblePageNumbers(
    pagination.page,
    pagination.totalPages,
  );

  const renderActions = (history: PatientAIHealthHistory) => (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => void handleView(history)}
        disabled={isViewing || isDeleting}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#C5B3D3] bg-white px-3 text-xs font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB] dark:hover:bg-[#41354A]"
      >
        {isViewing ? (
          <LuLoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <LuEye className="size-3.5" />
        )}
        View
      </button>

      <button
        type="button"
        onClick={() => setDeleteHistory(history)}
        disabled={isDeleting}
        className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
          canDelete
            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50"
        }`}
        title={
          canDelete
            ? "Delete saved AI health history"
            : "Blocked accounts can view history but cannot delete it"
        }
      >
        {canDelete ? (
          <LuTrash2 className="size-3.5" />
        ) : (
          <LuLockKeyhole className="size-3.5" />
        )}
        Delete
      </button>
    </div>
  );

  return (
    <section className="min-h-full bg-[#FFF9F9] p-3 dark:bg-[#211B27] sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <header className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                <LuFileHeart className="size-6" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#745D83] dark:text-[#F5CBCB]">
                  Patient dashboard
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  AI Health History
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                  Review summaries saved from your AI Health Assistant
                  conversations.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadHistories(page, true)}
              disabled={isLoading || isRefreshing || isDeleting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] bg-white px-4 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB] dark:hover:bg-[#41354A] sm:w-auto"
            >
              <LuRefreshCw
                className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="grid gap-px border-t border-[#F5CBCB] bg-[#F5CBCB] dark:border-[#41354A] dark:bg-[#41354A] sm:grid-cols-3">
            <div className="bg-[#FBEFEF]/70 px-5 py-3 dark:bg-[#352B3D]/80">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Patient
              </p>
              <p className="mt-1 truncate text-sm font-black text-slate-900 dark:text-white">
                {account?.name || "Loading..."}
              </p>
            </div>

            <div className="bg-[#FBEFEF]/70 px-5 py-3 dark:bg-[#352B3D]/80">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Saved reports
              </p>
              <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                {pagination.total}
              </p>
            </div>

            <div className="bg-[#FBEFEF]/70 px-5 py-3 dark:bg-[#352B3D]/80">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                Account access
              </p>
              <p
                className={`mt-1 text-sm font-black ${
                  account?.status === "blocked"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {account?.status === "blocked" ? "Read-only" : "Active"}
              </p>
            </div>
          </div>
        </header>

        {account?.status === "blocked" && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-200">
            <LuLockKeyhole className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-sm font-black">Read-only history access</p>
              <p className="mt-1 text-sm leading-6">
                Your blocked account can still view saved AI health histories,
                but deletion is disabled.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <LuLoaderCircle className="mx-auto size-9 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
                <p className="mt-3 text-sm font-bold text-slate-500 dark:text-[#A997AE]">
                  Loading your saved AI health histories...
                </p>
              </div>
            </div>
          ) : histories.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div>
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                  <LuMessageSquareText className="size-6" />
                </span>
                <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                  No saved AI health history
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                  Generate a summary from the AI Health Assistant to see it
                  here.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#F5CBCB] bg-[#FBEFEF]/60 text-left dark:border-[#41354A] dark:bg-[#352B3D]/70">
                      <th className="w-16 px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-[#A997AE]">
                        #
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-[#A997AE]">
                        Title & summary
                      </th>
                      <th className="w-48 px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-[#A997AE]">
                        Patient
                      </th>
                      <th className="w-52 px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-[#A997AE]">
                        Last updated
                      </th>
                      <th className="w-52 px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-slate-500 dark:text-[#A997AE]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {histories.map((history, index) => (
                      <tr
                        key={history.id}
                        className="border-b border-[#F5CBCB]/70 align-top last:border-b-0 hover:bg-[#FFF9F9] dark:border-[#41354A]/80 dark:hover:bg-[#352B3D]/45"
                      >
                        <td className="px-5 py-4 text-sm font-black text-slate-400">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td>

                        <td className="min-w-0 px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-xl truncate text-sm font-black text-slate-950 dark:text-white">
                              {getHistoryTitle(history)}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${urgencyClasses[history.report.urgencyLevel]}`}
                            >
                              {history.report.urgencyLevel}
                            </span>
                          </div>
                          <p className="mt-1.5 max-w-2xl line-clamp-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                            {getHistoryMessage(history)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
                            <LuUserRound className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                            <span className="truncate">
                              {history.patientName || history.userName}
                            </span>
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-500 dark:text-[#A997AE]">
                            <LuCalendarClock className="mt-1 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                            {formatDateTime(
                              history.updatedAt || history.createdAt,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {renderActions(history)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#F5CBCB] dark:divide-[#41354A] md:hidden">
                {histories.map((history, index) => (
                  <article key={history.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                          History{" "}
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </p>
                        <h2 className="mt-1 break-words text-base font-black text-slate-950 dark:text-white">
                          {getHistoryTitle(history)}
                        </h2>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${urgencyClasses[history.report.urgencyLevel]}`}
                      >
                        {history.report.urgencyLevel}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                      {getHistoryMessage(history)}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs font-semibold text-slate-400">
                      <p className="flex items-center gap-2">
                        <LuUserRound className="size-3.5" />
                        {history.patientName || history.userName}
                      </p>
                      <p className="flex items-center gap-2">
                        <LuCalendarClock className="size-3.5" />
                        {formatDateTime(
                          history.updatedAt || history.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="mt-4">{renderActions(history)}</div>
                  </article>
                ))}
              </div>
            </>
          )}

          {!isLoading && pagination.total > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#F5CBCB] px-4 py-4 dark:border-[#41354A] sm:px-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-600 dark:text-[#CDBFD0]">
                  Showing {firstVisibleItem}-{lastVisibleItem} of{" "}
                  {pagination.total} saved histories
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  Page {pagination.page} of {pagination.totalPages} · 10 records
                  per page
                </p>
              </div>

              <nav
                className="flex flex-wrap items-center gap-2"
                aria-label="AI health history pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={pagination.page <= 1 || isLoading || isDeleting}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#C5B3D3] bg-white px-3 text-xs font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                  aria-label="Go to previous page"
                >
                  <LuChevronLeft className="size-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {visiblePageNumbers.map((pageNumber) => {
                    const isCurrentPage = pageNumber === pagination.page;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        disabled={isLoading || isDeleting || isCurrentPage}
                        className={`flex size-10 items-center justify-center rounded-xl text-xs font-black transition disabled:cursor-default ${
                          isCurrentPage
                            ? "bg-[#745D83] text-white shadow-sm dark:bg-[#C5B3D3] dark:text-[#211B27]"
                            : "border border-[#C5B3D3] bg-white text-[#614E70] hover:bg-[#FBEFEF] disabled:opacity-100 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                        }`}
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={isCurrentPage ? "page" : undefined}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.min(pagination.totalPages, current + 1),
                    )
                  }
                  disabled={
                    pagination.page >= pagination.totalPages ||
                    isLoading ||
                    isDeleting
                  }
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#C5B3D3] bg-white px-3 text-xs font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                  aria-label="Go to next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <LuChevronRight className="size-4" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <AIHealthHistoryViewModal
        history={viewHistory}
        onClose={() => setViewHistory(null)}
      />

      <AIHealthHistoryDeleteModal
        history={deleteHistory}
        canDelete={canDelete}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setDeleteHistory(null);
          }
        }}
        onConfirm={() => void handleDeleteConfirm()}
      />

      <ToastContainer
        position="top-right"
        autoClose={1600}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        limit={3}
      />
    </section>
  );
};

export default PatientAiHealthHistory;