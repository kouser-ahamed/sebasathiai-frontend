// import "server-only";

// import { unstable_noStore as noStore } from "next/cache";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { auth } from "../auth";
// import { getTokenServer } from "../getTokenServer";

// export type UserRole = "admin" | "doctor" | "patient";

// export type UserStatus = "active" | "blocked";

// export interface SessionUser {
//   id?: string;
//   _id?: string;
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
//   role: UserRole;
//   status: UserStatus;
//   [key: string]: unknown;
// }

// interface RawUser {
//   id?: string | null;
//   _id?: string | null;
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
//   role?: string | null;
//   status?: string | null;
//   [key: string]: unknown;
// }

// const VALID_ROLES: UserRole[] = ["admin", "doctor", "patient"];

// const isValidRole = (role: unknown): role is UserRole => {
//   return typeof role === "string" && VALID_ROLES.includes(role as UserRole);
// };

// const normalizeRole = (role: unknown): UserRole => {
//   return isValidRole(role) ? role : "patient";
// };

// const normalizeStatus = (status: unknown): UserStatus => {
//   return status === "blocked" ? "blocked" : "active";
// };

// const isRecord = (value: unknown): value is Record<string, unknown> => {
//   return typeof value === "object" && value !== null && !Array.isArray(value);
// };

// export const getUserSession = async (): Promise<SessionUser | null> => {
//   noStore();

//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     const sessionUser = session?.user as RawUser | undefined;

//     if (!sessionUser?.id && !sessionUser?._id && !sessionUser?.email) {
//       return null;
//     }

//     const normalizedSessionUser: SessionUser = {
//       ...sessionUser,

//       id: sessionUser.id || sessionUser._id || undefined,

//       _id: sessionUser._id || sessionUser.id || undefined,

//       role: normalizeRole(sessionUser.role),

//       status: normalizeStatus(sessionUser.status),
//     };

//     const token = await getTokenServer();

//     const baseURL =
//       process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

//     if (!token || !baseURL) {
//       return normalizedSessionUser;
//     }

//     const response = await fetch(
//       `${baseURL.replace(/\/+$/, "")}/api/users/current`,
//       {
//         method: "GET",

//         headers: {
//           authorization: `Bearer ${token}`,

//           accept: "application/json",
//         },

//         cache: "no-store",
//       },
//     );

//     if (!response.ok) {
//       return normalizedSessionUser;
//     }

//     const responseData: unknown = await response.json();

//     const freshUserData =
//       isRecord(responseData) && isRecord(responseData.user)
//         ? responseData.user
//         : responseData;

//     if (!isRecord(freshUserData)) {
//       return normalizedSessionUser;
//     }

//     const freshUser = freshUserData as RawUser;

//     const userId =
//       freshUser.id ||
//       freshUser._id ||
//       normalizedSessionUser.id ||
//       normalizedSessionUser._id;

//     return {
//       ...normalizedSessionUser,
//       ...freshUser,

//       id: userId,
//       _id: userId,

//       role: normalizeRole(freshUser.role || normalizedSessionUser.role),

//       status: normalizeStatus(freshUser.status || normalizedSessionUser.status),
//     };
//   } catch (error: unknown) {
//     console.error("Failed to get user session:", error);

//     return null;
//   }
// };

// export const requireRole = async (
//   requiredRole: UserRole,
// ): Promise<SessionUser> => {
//   const user = await getUserSession();

//   if (!user?.id) {
//     redirect("/auth/signin");
//   }

//   /*
//    * Separate blocked page nei.
//    * Blocked user home page-e chole jabe.
//    */
//   if (user.status === "blocked") {
//     redirect("/");
//   }

//   if (user.role !== requiredRole) {
//     if (isValidRole(user.role)) {
//       redirect(`/dashboard/${user.role}`);
//     }

//     redirect("/unauthorized");
//   }

//   return user;
// };


import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../auth";
import { getTokenServer } from "../getTokenServer";

export type UserRole =
  | "admin"
  | "doctor"
  | "patient";

export type UserStatus =
  | "active"
  | "blocked";

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
    VALID_ROLES.includes(
      role as UserRole,
    )
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
  return status === "blocked"
    ? "blocked"
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
 * It reads the Better Auth session first.
 * When an API token is available, it also
 * loads the latest role and status from
 * the backend database.
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
        session?.user as
          | RawUser
          | undefined;

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
        process.env
          .NEXT_PUBLIC_API_URL ||
        process.env
          .NEXT_PUBLIC_BASE_URL;

      /*
       * When the API is not configured,
       * safely use the Better Auth session.
       */
      if (!token || !baseURL) {
        return normalizedSessionUser;
      }

      const response = await fetch(
        `${baseURL.replace(
          /\/+$/,
          "",
        )}/api/users/current`,
        {
          method: "GET",

          headers: {
            authorization:
              `Bearer ${token}`,
            accept:
              "application/json",
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
       * Supports:
       *
       * 1. { id, name, role, status }
       * 2. { user: { id, name, role, status } }
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
    } catch (error: unknown) {
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
 * Active and blocked users can enter their own dashboard.
 * Backend mutation APIs enforce read-only access for blocked users.
 *
 * Example:
 * const user = await requireRole("admin");
 */
export const requireRole = async (
  requiredRole: UserRole,
): Promise<SessionUser> => {
  const user =
    await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  if (
    user.role !== requiredRole
  ) {
    if (isValidRole(user.role)) {
      redirect(
        `/dashboard/${user.role}`,
      );
    }

    redirect("/unauthorized");
  }

  return user;
};
