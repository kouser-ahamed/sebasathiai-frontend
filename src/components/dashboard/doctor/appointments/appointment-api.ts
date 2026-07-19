"use client";

import { getTokenClient } from "@/lib/getTokenClient";

import type {
  AppointmentMutationResponse,
  AppointmentStatus,
  DoctorAppointmentDetailsResponse,
  DoctorAppointmentsResponse,
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
    const data = (await response.json()) as {
      message?: unknown;
    };

    if (
      typeof data.message === "string" &&
      data.message.trim()
    ) {
      return data.message;
    }
  } catch {
    // Use fallback below.
  }

  return `Request failed with status ${response.status}`;
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
    throw new Error(
      await readError(response),
    );
  }

  return (await response.json()) as T;
};

export const fetchDoctorAppointments = (
  page: number,
  status: AppointmentStatus | "",
  search: string,
): Promise<DoctorAppointmentsResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (status) {
    params.set("status", status);
  }

  if (search.trim()) {
    params.set("search", search.trim());
  }

  return authenticatedRequest<DoctorAppointmentsResponse>(
    `/api/v1/doctor/appointments?${params.toString()}`,
  );
};

export const fetchDoctorAppointmentDetails = (
  appointmentId: string,
): Promise<DoctorAppointmentDetailsResponse> =>
  authenticatedRequest<DoctorAppointmentDetailsResponse>(
    `/api/v1/doctor/appointments/${encodeURIComponent(appointmentId)}`,
  );

export const updateDoctorAppointmentStatus = (
  appointmentId: string,
  status: Exclude<AppointmentStatus, "pending">,
  rejectionReason = "",
): Promise<AppointmentMutationResponse> =>
  authenticatedRequest<AppointmentMutationResponse>(
    `/api/v1/appointments/${encodeURIComponent(appointmentId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
        rejectionReason,
      }),
    },
  );

export const rescheduleDoctorAppointment = (
  appointmentId: string,
  appointmentDate: string,
  appointmentTime: string,
  rescheduleReason = "",
): Promise<AppointmentMutationResponse> =>
  authenticatedRequest<AppointmentMutationResponse>(
    `/api/v1/doctor/appointments/${encodeURIComponent(appointmentId)}/reschedule`,
    {
      method: "PATCH",
      body: JSON.stringify({
        appointmentDate,
        appointmentTime,
        rescheduleReason,
      }),
    },
  );