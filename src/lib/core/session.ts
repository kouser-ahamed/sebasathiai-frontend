import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { auth } from "../auth";
import { getTokenServer } from "../getTokenServer";

export type UserRole = "admin" | "doctor" | "patient";

export type UserStatus =
  | "active"
  | "blocked"
  | "pending"
  | string;

export interface SessionUser {
  id?: string;
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  [key: string]: unknown;
}

interface RawUser {
  id?: string | null;
  _id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
  [key: string]: unknown;
}

const VALID_ROLES: UserRole[] = [
  "admin",
  "doctor",
  "patient",
];

const isValidRole = (
  role: unknown,
): role is UserRole => {
  return (
    typeof role === "string" &&
    VALID_ROLES.includes(role as UserRole)
  );
};

const normalizeRole = (
  role: unknown,
): UserRole => {
  return isValidRole(role)
    ? role
    : "patient";
};

const normalizeStatus = (
  status: unknown,
): UserStatus => {
  return typeof status === "string" &&
    status.trim()
    ? status
    : "active";
};

const isRecord = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

/**
 * Returns the authenticated user.
 *
 * First it reads the Better Auth session. If a server token is
 * available, it requests the latest user data from the database.
 */
export const getUserSession =
  async (): Promise<SessionUser | null> => {
    noStore();

    try {
      const session =
        await auth.api.getSession({
          headers: await headers(),
        });

      const sessionUser =
        session?.user as RawUser | undefined;

      if (
        !sessionUser?.id &&
        !sessionUser?._id &&
        !sessionUser?.email
      ) {
        return null;
      }

      const normalizedSessionUser: SessionUser =
        {
          ...sessionUser,
          id:
            sessionUser.id ||
            sessionUser._id ||
            undefined,
          _id:
            sessionUser._id ||
            sessionUser.id ||
            undefined,
          role: normalizeRole(
            sessionUser.role,
          ),
          status: normalizeStatus(
            sessionUser.status,
          ),
        };

      const token =
        await getTokenServer();

      const baseURL =
        process.env.NEXT_PUBLIC_BASE_URL;

      /*
       * If the API token or base URL is unavailable,
       * return the current authentication session.
       */
      if (!token || !baseURL) {
        return normalizedSessionUser;
      }

      const response = await fetch(
        `${baseURL.replace(/\/$/, "")}/api/users/current`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return normalizedSessionUser;
      }

      const responseData: unknown =
        await response.json();

      /*
       * Supports both API response formats:
       *
       * 1. { id, name, role, ... }
       * 2. { user: { id, name, role, ... } }
       */
      const freshUserData =
        isRecord(responseData) &&
        isRecord(responseData.user)
          ? responseData.user
          : responseData;

      if (!isRecord(freshUserData)) {
        return normalizedSessionUser;
      }

      const freshUser =
        freshUserData as RawUser;

      const userId =
        freshUser.id ||
        freshUser._id ||
        normalizedSessionUser.id ||
        normalizedSessionUser._id;

      return {
        ...normalizedSessionUser,
        ...freshUser,
        id: userId,
        _id: userId,
        role: normalizeRole(
          freshUser.role ||
            normalizedSessionUser.role,
        ),
        status: normalizeStatus(
          freshUser.status ||
            normalizedSessionUser.status,
        ),
      };
    } catch (error) {
      console.error(
        "Failed to get user session:",
        error,
      );

      return null;
    }
  };

/**
 * Protects a role-specific server page or layout.
 *
 * Example:
 * const user = await requireRole("admin");
 */
export const requireRole = async (
  requiredRole: UserRole,
): Promise<SessionUser> => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  if (user.role !== requiredRole) {
    if (isValidRole(user.role)) {
      redirect(
        `/dashboard/${user.role}`,
      );
    }

    redirect("/unauthorized");
  }

  return user;
};