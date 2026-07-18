"use client";

import { getTokenClient } from "@/lib/getTokenClient";
import { DeleteDoctorResponse, DoctorFormValues, DoctorMutationResponse, DoctorsResponse, DoctorStatus } from "./types";



const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is not configured",
    );
  }

  return baseUrl.replace(/\/+$/, "");
};

const readError = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { message?: unknown };
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
  } catch {
    // Use the fallback below.
  }

  return `Request failed with status ${response.status}`;
};

const request = async <T>(
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
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
};

const doctorPayload = (
  values: DoctorFormValues,
  includePassword: boolean,
) => {
  const payload: Record<string, string | number> = {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    specialization: values.specialization.trim(),
    qualification: values.qualification.trim(),
    experienceYears: Number(values.experienceYears) || 0,
    chamber: values.chamber.trim(),
    address: values.address.trim(),
    bio: values.bio.trim(),
    image: values.image.trim(),
  };

  if (includePassword) {
    payload.password = values.password;
  }

  return payload;
};

export const fetchDoctorsClient = (): Promise<DoctorsResponse> =>
  request<DoctorsResponse>("/api/v1/admin/doctors?limit=100");

export const createDoctor = (
  values: DoctorFormValues,
): Promise<DoctorMutationResponse> =>
  request<DoctorMutationResponse>("/api/v1/admin/doctors", {
    method: "POST",
    body: JSON.stringify(doctorPayload(values, true)),
  });

export const updateDoctor = (
  doctorId: string,
  values: DoctorFormValues,
): Promise<DoctorMutationResponse> =>
  request<DoctorMutationResponse>(
    `/api/v1/admin/doctors/${encodeURIComponent(doctorId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(doctorPayload(values, false)),
    },
  );

export const updateDoctorStatus = (
  doctorId: string,
  status: DoctorStatus,
): Promise<DoctorMutationResponse> =>
  request<DoctorMutationResponse>(
    `/api/v1/admin/doctors/${encodeURIComponent(doctorId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

export const deleteDoctor = (
  doctorId: string,
): Promise<DeleteDoctorResponse> =>
  request<DeleteDoctorResponse>(
    `/api/v1/admin/doctors/${encodeURIComponent(doctorId)}`,
    { method: "DELETE" },
  );