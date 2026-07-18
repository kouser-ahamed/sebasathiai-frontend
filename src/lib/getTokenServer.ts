import "server-only";

import { headers } from "next/headers";

import { auth } from "./auth";

export const getTokenServer =
  async (): Promise<string | null> => {
    try {
      const requestHeaders =
        await headers();

      const result =
        await auth.api.getToken({
          headers: requestHeaders,
        });

      const token = result?.token;

      if (
        typeof token !== "string" ||
        token.trim().length === 0
      ) {
        return null;
      }

      return token;
    } catch (error: unknown) {
      console.error(
        "Get token server error:",
        error,
      );

      return null;
    }
  };