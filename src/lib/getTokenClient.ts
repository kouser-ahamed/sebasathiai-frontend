"use client";

import { authClient } from "@/lib/auth-client";

export interface ClientTokenData {
  token: string;
  [key: string]: unknown;
}

export interface GetTokenClientResult {
  data: ClientTokenData | null;
  error: unknown | null;
}

const isTokenData = (
  value: unknown,
): value is ClientTokenData => {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const token = Reflect.get(value, "token");

  return (
    typeof token === "string" &&
    token.trim().length > 0
  );
};

export const getTokenClient =
  async (): Promise<GetTokenClientResult> => {
    try {
      const result =
        await authClient.token();

      if (!isTokenData(result?.data)) {
        return {
          data: null,
          error:
            result?.error ||
            new Error(
              "Authentication token was not found.",
            ),
        };
      }

      return {
        data: result.data,
        error: null,
      };
    } catch (error: unknown) {
      console.error(
        "Get token client error:",
        error,
      );

      return {
        data: null,
        error,
      };
    }
  };