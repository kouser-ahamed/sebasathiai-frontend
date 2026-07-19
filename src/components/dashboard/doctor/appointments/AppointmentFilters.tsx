"use client";

import {
  LuRefreshCw,
  LuSearch,
} from "react-icons/lu";

import type {
  AppointmentStatus,
} from "./types";

interface AppointmentFiltersProps {
  search: string;
  status: AppointmentStatus | "";
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onStatusChange: (
    value: AppointmentStatus | "",
  ) => void;
  onRefresh: () => void;
}

const AppointmentFilters = ({
  search,
  status,
  isLoading,
  onSearchChange,
  onSearchSubmit,
  onStatusChange,
  onRefresh,
}: AppointmentFiltersProps) => {
  return (
    <section className="rounded-3xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233]">
      <div className="flex flex-col gap-3 lg:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <LuSearch className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search patient name, email or health problem"
            className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
          />
        </form>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | AppointmentStatus
                | "",
            )
          }
          className="h-12 rounded-2xl border border-[#E4D5E7] bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#745D83] dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white"
        >
          <option value="">
            All statuses
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="approved">
            Approved
          </option>
          <option value="rejected">
            Rejected
          </option>
          <option value="completed">
            Complete Consultation
          </option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#C5B3D3] px-5 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
        >
          <LuRefreshCw
            className={`size-4 ${
              isLoading
                ? "animate-spin"
                : ""
            }`}
          />
          Refresh
        </button>
      </div>
    </section>
  );
};

export default AppointmentFilters;