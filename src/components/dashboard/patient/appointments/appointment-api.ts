"use client";

import { getTokenClient } from "@/lib/getTokenClient";

import type {
  AppointmentDeleteResponse,
  AppointmentMutationResponse,
  PatientAppointmentDetailsResponse,
  PatientAppointmentFormValues,
  PatientAppointmentsResponse,
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

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: unknown };

    if (typeof data.message === "string" && data.message.trim()) {
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
  const { data, error } = await getTokenClient();

  if (error || !data?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${data.token}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const fetchPatientAppointments = (
  page: number,
): Promise<PatientAppointmentsResponse> =>
  authenticatedRequest<PatientAppointmentsResponse>(
    `/api/v1/patient/appointments?page=${page}`,
  );

export const fetchPatientAppointmentDetails = (
  appointmentId: string,
): Promise<PatientAppointmentDetailsResponse> =>
  authenticatedRequest<PatientAppointmentDetailsResponse>(
    `/api/v1/patient/appointments/${encodeURIComponent(appointmentId)}`,
  );

export const updatePatientAppointment = (
  appointmentId: string,
  values: PatientAppointmentFormValues,
): Promise<AppointmentMutationResponse> =>
  authenticatedRequest<AppointmentMutationResponse>(
    `/api/v1/patient/appointments/${encodeURIComponent(appointmentId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        patientName: values.patientName.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        problemTitle: values.problemTitle.trim(),
        symptomsDescription: values.symptomsDescription.trim(),
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
      }),
    },
  );

export const cancelPatientAppointment = (
  appointmentId: string,
): Promise<AppointmentDeleteResponse> =>
  authenticatedRequest<AppointmentDeleteResponse>(
    `/api/v1/patient/appointments/${encodeURIComponent(appointmentId)}`,
    { method: "DELETE" },
  );