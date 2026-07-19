"use client";

import { getTokenClient } from "@/lib/getTokenClient";

import type {
  AIHealthAccessResponse,
  AIHealthConversationListResponse,
  AIHealthConversationResponse,
  AIHealthDeleteConversationResponse,
  AIHealthPersistentChatResponse,
  AIHealthStreamEvent,
  AIHealthStreamHandlers,
  AIHealthSummaryResponse,
} from "./types";

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

export const checkAIHealthAccess =
  async (): Promise<AIHealthAccessResponse | null> => {
    const token = await getAccessToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${getApiBaseUrl()}/api/v1/ai-health/access`, {
      cache: "no-store",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return (await response.json()) as AIHealthAccessResponse;
  };

export const fetchAIHealthConversations =
  (): Promise<AIHealthConversationListResponse> =>
    authenticatedRequest<AIHealthConversationListResponse>(
      "/api/v1/ai-health/conversations?limit=100",
    );

export const createAIHealthConversation =
  (): Promise<AIHealthConversationResponse> =>
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

export const streamPersistentAIHealthMessage = async (
  conversationId: string,
  message: string,
  handlers: AIHealthStreamHandlers = {},
): Promise<AIHealthPersistentChatResponse> => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/ai-health/conversations/${encodeURIComponent(conversationId)}/messages/stream`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        accept: "application/x-ndjson",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (!response.body) {
    throw new Error("The streaming response is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: AIHealthPersistentChatResponse | null = null;

  const processLine = (line: string) => {
    const trimmed = line.trim();

    if (!trimmed) return;

    const event = JSON.parse(trimmed) as AIHealthStreamEvent;

    if (event.type === "status") {
      handlers.onStatus?.(event);
      return;
    }

    if (event.type === "delta") {
      handlers.onDelta?.(event.delta);
      return;
    }

    if (event.type === "error") {
      throw new Error(event.message);
    }

    result = event.data;
  };

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        processLine(line);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      processLine(buffer);
    }
  } finally {
    reader.releaseLock();
  }

  if (!result) {
    throw new Error("The streamed response ended before the chat was saved.");
  }

  return result;
};

export const generateAIHealthSummary = (
  conversationId: string,
): Promise<AIHealthSummaryResponse> =>
  authenticatedRequest<AIHealthSummaryResponse>("/api/v1/ai-health/summary", {
    method: "POST",
    body: JSON.stringify({ conversationId }),
  });

export const deleteAIHealthConversation = (
  conversationId: string,
): Promise<AIHealthDeleteConversationResponse> =>
  authenticatedRequest<AIHealthDeleteConversationResponse>(
    `/api/v1/ai-health/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "DELETE",
    },
  );