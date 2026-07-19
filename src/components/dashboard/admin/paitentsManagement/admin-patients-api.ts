"use client";

import { getTokenClient } from "@/lib/getTokenClient";
import { AdminPatientDeleteResponse, AdminPatientDetailsResponse, AdminPatientsListResponse, AdminPatientStatus, AdminPatientStatusResponse, PatientStatusFilter } from "./ index";



const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is not configured.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as {
      message?: unknown;
    };

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
    throw new Error("Authentication is required.");
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${data.token}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const fetchAdminPatients = ({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: PatientStatusFilter;
}): Promise<AdminPatientsListResponse> => {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status !== "all") {
    params.set("status", status);
  }

  return authenticatedRequest<AdminPatientsListResponse>(
    `/api/v1/admin/patients?${params.toString()}`,
  );
};

export const fetchAdminPatient = (
  patientId: string,
): Promise<AdminPatientDetailsResponse> =>
  authenticatedRequest<AdminPatientDetailsResponse>(
    `/api/v1/admin/patients/${encodeURIComponent(patientId)}`,
  );

export const updateAdminPatientStatus = (
  patientId: string,
  status: AdminPatientStatus,
): Promise<AdminPatientStatusResponse> =>
  authenticatedRequest<AdminPatientStatusResponse>(
    `/api/v1/admin/patients/${encodeURIComponent(patientId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

export const deleteAdminPatient = (
  patientId: string,
): Promise<AdminPatientDeleteResponse> =>
  authenticatedRequest<AdminPatientDeleteResponse>(
    `/api/v1/admin/patients/${encodeURIComponent(patientId)}`,
    {
      method: "DELETE",
    },
  );