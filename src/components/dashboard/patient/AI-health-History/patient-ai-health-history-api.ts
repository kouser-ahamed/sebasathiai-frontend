"use client";

import { getTokenClient } from "@/lib/getTokenClient";
import { PatientAIHealthHistoryDeleteResponse, PatientAIHealthHistoryDetailsResponse, PatientAIHealthHistoryListResponse } from "./ types";



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

const getAccessToken = async (): Promise<string> => {
  const { data, error } = await getTokenClient();

  if (error || !data?.token) {
    throw new Error("Authentication is required.");
  }

  return data.token;
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
    // Use the status fallback below.
  }

  return `Request failed with status ${response.status}`;
};

const authenticatedRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const token = await getAccessToken();

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const fetchPatientAIHealthHistories = (
  page = 1,
  _limit = 10,
): Promise<PatientAIHealthHistoryListResponse> =>
  authenticatedRequest<PatientAIHealthHistoryListResponse>(
    `/api/v1/patient/ai-health-history?page=${Math.max(1, Math.floor(page))}`,
  );

export const fetchPatientAIHealthHistory = (
  historyId: string,
): Promise<PatientAIHealthHistoryDetailsResponse> =>
  authenticatedRequest<PatientAIHealthHistoryDetailsResponse>(
    `/api/v1/patient/ai-health-history/${encodeURIComponent(historyId)}`,
  );

export const deletePatientAIHealthHistory = (
  historyId: string,
): Promise<PatientAIHealthHistoryDeleteResponse> =>
  authenticatedRequest<PatientAIHealthHistoryDeleteResponse>(
    `/api/v1/patient/ai-health-history/${encodeURIComponent(historyId)}`,
    {
      method: "DELETE",
    },
  );