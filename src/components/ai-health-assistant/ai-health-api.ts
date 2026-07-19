"use client";

import { getTokenClient } from "@/lib/getTokenClient";

import type {
  AIHealthAccessResponse,
  AIHealthConversationListResponse,
  AIHealthConversationResponse,
  AIHealthDeleteConversationResponse,
  AIHealthPersistentChatResponse,
  AIHealthSummaryResponse,
} from "./types";

const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is not configured.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
};

const readErrorMessage = async (
  response: Response,
): Promise<string> => {
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

const getAccessToken = async (): Promise<string | null> => {
  const { data, error } = await getTokenClient();

  if (error || !data?.token) {
    return null;
  }

  return data.token;
};

const authenticatedRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

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

export const checkAIHealthAccess = async (): Promise<
  AIHealthAccessResponse | null
> => {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/ai-health/access`,
    {
      cache: "no-store",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as AIHealthAccessResponse;
};

export const fetchAIHealthConversations = (): Promise<AIHealthConversationListResponse> =>
  authenticatedRequest<AIHealthConversationListResponse>(
    "/api/v1/ai-health/conversations?limit=100",
  );

export const createAIHealthConversation = (): Promise<AIHealthConversationResponse> =>
  authenticatedRequest<AIHealthConversationResponse>(
    "/api/v1/ai-health/conversations",
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

export const fetchAIHealthConversation = (
  conversationId: string,
): Promise<AIHealthConversationResponse> =>
  authenticatedRequest<AIHealthConversationResponse>(
    `/api/v1/ai-health/conversations/${encodeURIComponent(conversationId)}`,
  );

export const sendPersistentAIHealthMessage = (
  conversationId: string,
  message: string,
): Promise<AIHealthPersistentChatResponse> =>
  authenticatedRequest<AIHealthPersistentChatResponse>(
    `/api/v1/ai-health/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );

export const generateAIHealthSummary = (
  conversationId: string,
): Promise<AIHealthSummaryResponse> =>
  authenticatedRequest<AIHealthSummaryResponse>(
    "/api/v1/ai-health/summary",
    {
      method: "POST",
      body: JSON.stringify({ conversationId }),
    },
  );

export const deleteAIHealthConversation = (
  conversationId: string,
): Promise<AIHealthDeleteConversationResponse> =>
  authenticatedRequest<AIHealthDeleteConversationResponse>(
    `/api/v1/ai-health/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "DELETE",
    },
  );