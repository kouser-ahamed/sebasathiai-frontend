"use client";

import { LuListFilter, LuRotateCcw } from "react-icons/lu";

import type { DoctorFiltersData, DoctorQuery } from "./types";

interface DoctorFiltersProps {
  filters: DoctorFiltersData;
  query: DoctorQuery;
  onChange: (field: keyof DoctorQuery, value: string) => void;
  onReset: () => void;
}

const selectClassName =
  "h-11 w-full rounded-xl border border-[#E4D5E7] bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white";

const DoctorFilters = ({
  filters,
  query,
  onChange,
  onReset,
}: DoctorFiltersProps) => {
  return (
    <section className="rounded-3xl border border-[#F5CBCB] bg-[#FBEFEF]/55 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/55">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-white">
          <LuListFilter className="size-5 text-[#745D83] dark:text-[#F5CBCB]" />
          Filter Doctors
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#745D83] hover:text-[#614E70] dark:text-[#F5CBCB]"
        >
          <LuRotateCcw className="size-4" /> Reset
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <select
          value={query.specialization}
          onChange={(event) =>
            onChange("specialization", event.target.value)
          }
          className={selectClassName}
        >
          <option value="">All specializations</option>
          {filters.specializations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={query.qualification}
          onChange={(event) =>
            onChange("qualification", event.target.value)
          }
          className={selectClassName}
        >
          <option value="">All qualifications</option>
          {filters.qualifications.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={query.hospital}
          onChange={(event) =>
            onChange("hospital", event.target.value)
          }
          className={selectClassName}
        >
          <option value="">All hospitals</option>
          {filters.hospitals.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={query.experienceYears}
          onChange={(event) =>
            onChange("experienceYears", event.target.value)
          }
          className={selectClassName}
        >
          <option value="">All experience levels</option>
          {filters.experienceYears.map((item) => (
            <option key={item} value={String(item)}>
              {item} year{item === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default DoctorFilters;