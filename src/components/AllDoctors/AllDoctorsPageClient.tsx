"use client";

import { useEffect, useRef, useState } from "react";
import { LuLoaderCircle, LuStethoscope } from "react-icons/lu";

import DoctorCard from "./DoctorCard";
import DoctorFilters from "./DoctorFilters";
import DoctorSearch from "./DoctorSearch";
import { fetchPublicDoctors } from "./public-api";

import type {
  Doctor,
  DoctorFiltersData,
  DoctorQuery,
  Pagination,
} from "./types";

interface AllDoctorsPageClientProps {
  initialDoctors: Doctor[];
  initialFilters: DoctorFiltersData;
  initialPagination: Pagination;
  initialError?: string;
}

const emptyQuery: DoctorQuery = {
  search: "",
  specialization: "",
  qualification: "",
  hospital: "",
  experienceYears: "",
  page: 1,
};

const AllDoctorsPageClient = ({
  initialDoctors,
  initialFilters,
  initialPagination,
  initialError = "",
}: AllDoctorsPageClientProps) => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [pagination, setPagination] = useState(initialPagination);
  const [query, setQuery] = useState<DoctorQuery>(emptyQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetchPublicDoctors(query);

        if (!cancelled) {
          setDoctors(response.doctors);
          setPagination(response.pagination);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Doctor data could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const updateFilter = (
    field: keyof DoctorQuery,
    value: string,
  ) => {
    setQuery((current) => ({
      ...current,
      [field]: value,
      page: 1,
    }));
  };

  return (
    <main className="min-h-screen bg-[#FFF9F9] py-10 dark:bg-[#211B27]">
      <div className="mx-auto w-full max-w-7xl space-y-7 px-4 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-[#F5CBCB] bg-gradient-to-br from-white via-[#FBEFEF] to-[#FFE2E2] p-6 shadow-sm dark:border-[#41354A] dark:from-[#2A2233] dark:via-[#352B3D] dark:to-[#41354A] sm:p-9">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#745D83] shadow-sm dark:bg-[#211B27]/75 dark:text-[#F5CBCB]">
              <LuStethoscope className="size-4" /> Government Medical Service
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Find the right doctor for your healthcare needs
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#CDBFD0] sm:text-base">
              Search doctors by name, specialization or qualification. Filter automatically generated hospital and experience categories, then request a free appointment.
            </p>
          </div>
        </header>

        <section className="space-y-4 rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-5">
          <DoctorSearch
            initialValue={query.search}
            onSearch={(value) =>
              setQuery((current) => ({ ...current, search: value, page: 1 }))
            }
          />

          <DoctorFilters
            filters={initialFilters}
            query={query}
            onChange={updateFilter}
            onReset={() => setQuery(emptyQuery)}
          />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Available Doctors
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#A997AE]">
              {pagination.total} doctor{pagination.total === 1 ? "" : "s"} found. Higher-rated doctors appear first; unrated doctors are ordered newest first.
            </p>
          </div>

          {isLoading && (
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
              <LuLoaderCircle className="size-5 animate-spin" /> Loading...
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {!isLoading && doctors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#C5B3D3] bg-white p-12 text-center dark:border-[#5D4C69] dark:bg-[#2A2233]">
            <LuStethoscope className="mx-auto size-10 text-[#745D83] dark:text-[#F5CBCB]" />
            <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">No doctors matched your search</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-[#A997AE]">Reset the filters or try a different keyword.</p>
          </div>
        ) : (
          <section className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isLoading ? "opacity-60" : ""}`}>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </section>
        )}

        {pagination.totalPages > 1 && (
          <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Doctor pagination">
            <button
              type="button"
              disabled={query.page <= 1 || isLoading}
              onClick={() => setQuery((current) => ({ ...current, page: current.page - 1 }))}
              className="h-10 rounded-xl border border-[#E4D5E7] bg-white px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, query.page - 3), Math.max(5, query.page + 2))
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setQuery((current) => ({ ...current, page: pageNumber }))}
                  className={`size-10 rounded-xl text-sm font-black transition ${
                    pageNumber === query.page
                      ? "bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
                      : "border border-[#E4D5E7] bg-white text-slate-700 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

            <button
              type="button"
              disabled={query.page >= pagination.totalPages || isLoading}
              onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))}
              className="h-10 rounded-xl border border-[#E4D5E7] bg-white px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default AllDoctorsPageClient;