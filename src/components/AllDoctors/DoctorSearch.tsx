"use client";

import { FormEvent, useState } from "react";
import { LuSearch } from "react-icons/lu";

interface DoctorSearchProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

const DoctorSearch = ({
  initialValue,
  onSearch,
}: DoctorSearchProps) => {
  const [value, setValue] = useState(initialValue);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label className="relative flex-1">
        <span className="sr-only">Search doctors</span>
        <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by doctor name, specialization or qualification"
          className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#745D83] focus:ring-4 focus:ring-[#C5B3D3]/25 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
        />
      </label>

      <button
        type="submit"
        className="h-12 rounded-2xl bg-[#745D83] px-6 text-sm font-black text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27]"
      >
        Search Doctors
      </button>
    </form>
  );
};

export default DoctorSearch;