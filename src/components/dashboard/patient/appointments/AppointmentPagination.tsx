"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface AppointmentPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const AppointmentPagination = ({
  page,
  totalPages,
  total,
  onPageChange,
}: AppointmentPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233] sm:flex-row">
      <p className="text-center text-sm font-semibold text-slate-500 dark:text-[#A997AE] sm:text-left">
        Page {page} of {totalPages} · {total} appointments
      </p>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E4D5E7] px-4 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#5D4C69] dark:text-white dark:hover:bg-[#352B3D]"
        >
          <LuChevronLeft className="size-4" /> Previous
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-4 text-sm font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#C5B3D3] dark:text-[#211B27]"
        >
          Next <LuChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentPagination;