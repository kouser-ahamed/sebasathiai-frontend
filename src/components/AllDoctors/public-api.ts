"use client";

import { getTokenClient } from "@/lib/getTokenClient";

import type {
  AppointmentEligibilityResponse,
  AppointmentFormValues,
  AppointmentMutationResponse,
  AppointmentsResponse,
  AppointmentStatus,
  DoctorDetailsResponse,
  DoctorFiltersResponse,
  DoctorQuery,
  DoctorsResponse,
  ReviewMutationResponse,
  ReviewsResponse,
  UserRole,
} from "./types";

const getApiBaseUrl = (): string => {
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

const readError = async (
  response: Response,
): Promise<string> => {
  try {
    const body = (await response.json()) as {
      message?: unknown;
    };

    if (
      typeof body.message === "string" &&
      body.message.trim()
    ) {
      return body.message;
    }
  } catch {
    // Use fallback.
  }

  return `Request failed with status ${response.status}`;
};

const publicRequest = async <T>(
  path: string,
): Promise<T> => {
  const response = await fetch(
    `${getApiBaseUrl()}${path}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
};

const authenticatedRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const { data, error } =
    await getTokenClient();

  if (error || !data?.token) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const response = await fetch(
    `${getApiBaseUrl()}${path}`,
    {
      ...init,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${data.token}`,
        ...init.headers,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
};

export const fetchPublicDoctors = (
  query: DoctorQuery,
): Promise<DoctorsResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(query.page));

  if (query.search.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.specialization) {
    params.set(
      "specialization",
      query.specialization,
    );
  }

  if (query.qualification) {
    params.set(
      "qualification",
      query.qualification,
    );
  }

  if (query.hospital) {
    params.set("hospital", query.hospital);
  }

  if (query.experienceYears) {
    params.set(
      "experienceYears",
      query.experienceYears,
    );
  }

  return publicRequest<DoctorsResponse>(
    `/api/v1/doctors?${params.toString()}`,
  );
};

export const fetchDoctorFilters = () =>
  publicRequest<DoctorFiltersResponse>(
    "/api/v1/doctors/filters",
  );

export const fetchPublicDoctor = (
  doctorId: string,
) =>
  publicRequest<DoctorDetailsResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}`,
  );

export const fetchDoctorReviews = (
  doctorId: string,
  page = 1,
) =>
  publicRequest<ReviewsResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}/reviews?page=${page}&limit=20`,
  );

export const createDoctorReview = (
  doctorId: string,
  rating: number,
  review: string,
) =>
  authenticatedRequest<ReviewMutationResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}/reviews`,
    {
      method: "POST",
      body: JSON.stringify({ rating, review }),
    },
  );

export const updateDoctorReview = (
  doctorId: string,
  reviewId: string,
  rating: number,
  review: string,
) =>
  authenticatedRequest<ReviewMutationResponse>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}/reviews/${encodeURIComponent(reviewId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ rating, review }),
    },
  );

export const deleteDoctorReview = (
  doctorId: string,
  reviewId: string,
) =>
  authenticatedRequest<{
    success: boolean;
    message: string;
    deletedReviewId: string;
  }>(
    `/api/v1/doctors/${encodeURIComponent(doctorId)}/reviews/${encodeURIComponent(reviewId)}`,
    {
      method: "DELETE",
    },
  );

export const checkAppointmentEligibility = (
  doctorId: string,
) =>
  authenticatedRequest<AppointmentEligibilityResponse>(
    `/api/v1/appointments/eligibility/${encodeURIComponent(doctorId)}`,
  );

export const submitAppointment = (
  doctorId: string,
  values: AppointmentFormValues,
) =>
  authenticatedRequest<AppointmentMutationResponse>(
    "/api/v1/appointments",
    {
      method: "POST",
      body: JSON.stringify({
        doctorId,
        ...values,
      }),
    },
  );

export const fetchAppointments = (
  role: UserRole,
  status = "",
  search = "",
) => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);
  if (search.trim()) params.set("search", search.trim());

  const suffix = params.toString()
    ? `?${params.toString()}`
    : "";

  const path =
    role === "admin"
      ? `/api/v1/admin/appointments${suffix}`
      : role === "doctor"
        ? `/api/v1/doctor/appointments${suffix}`
        : "/api/v1/patient/appointments";

  return authenticatedRequest<AppointmentsResponse>(path);
};

export const updateAppointmentStatus = (
  appointmentId: string,
  status: Exclude<AppointmentStatus, "pending">,
) =>
  authenticatedRequest<AppointmentMutationResponse>(
    `/api/v1/appointments/${encodeURIComponent(appointmentId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );