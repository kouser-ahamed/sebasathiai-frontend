import "server-only";

import type {
  DoctorDetailsResponse,
  DoctorFiltersResponse,
  DoctorsResponse,
  ReviewsResponse,
} from "./types";

export const getPublicApiBaseUrl = (): string => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseURL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is not configured.",
    );
  }

  return baseURL.replace(/\/+$/, "");
};

const publicServerRequest = async <T>(
  path: string,
): Promise<T> => {
  const response = await fetch(
    `${getPublicApiBaseUrl()}${path}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => null)) as
      | { message?: unknown }
      | null;

    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as T;
};

export const getInitialDoctors = () =>
  publicServerRequest<DoctorsResponse>(
    "/api/v1/doctors?page=1",
  );

export const getDoctorFilterOptions = () =>
  publicServerRequest<DoctorFiltersResponse>(
    "/api/v1/doctors/filters",
  );

export const getPublicDoctorDetails = (
  doctorId: string,
) =>
  publicServerRequest<DoctorDetailsResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}`,
  );

export const getInitialDoctorReviews = (
  doctorId: string,
) =>
  publicServerRequest<ReviewsResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}/reviews?page=1&limit=20`,
  );