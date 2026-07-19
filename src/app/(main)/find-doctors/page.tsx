import AllDoctorsPageClient from "@/components/AllDoctors/AllDoctorsPageClient";
import {
  getDoctorFilterOptions,
  getInitialDoctors,
} from "@/components/AllDoctors/server-api";
import { DoctorFiltersData, Pagination } from "@/components/AllDoctors/types";


export const dynamic = "force-dynamic";
export const revalidate = 0;

const emptyFilters: DoctorFiltersData = {
  specializations: [],
  qualifications: [],
  hospitals: [],
  experienceYears: [],
};

const emptyPagination: Pagination = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
};

const FindDoctorsPage = async () => {
  let initialError = "";

  const [doctorsResult, filtersResult] =
    await Promise.allSettled([
      getInitialDoctors(),
      getDoctorFilterOptions(),
    ]);

  if (doctorsResult.status === "rejected") {
    initialError = doctorsResult.reason instanceof Error ? doctorsResult.reason.message : "Doctor data could not be loaded.";
  }

  return (
    <AllDoctorsPageClient
      initialDoctors={doctorsResult.status === "fulfilled" ? doctorsResult.value.doctors : []}
      initialPagination={doctorsResult.status === "fulfilled" ? doctorsResult.value.pagination : emptyPagination}
      initialFilters={filtersResult.status === "fulfilled" ? filtersResult.value.filters : emptyFilters}
      initialError={initialError}
    />
  );
};

export default FindDoctorsPage;