import ManageDoctors from "@/components/dashboard/admin/manage-doctors/ManageDoctors";
import type {
  Doctor,
  DoctorsResponse,
} from "@/components/dashboard/admin/manage-doctors/types";
import { requireRole } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ManageDoctorsPage = async () => {
  const user = await requireRole("admin");

  let initialDoctors: Doctor[] = [];
  let initialError = "";

  const token = await getTokenServer();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

  if (!token) {
    initialError = "Authentication token was not found. Please sign in again.";
  } else if (!apiBaseUrl) {
    initialError =
      "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is not configured.";
  } else {
    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/+$/, "")}/api/v1/admin/doctors?limit=100`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: unknown;
        } | null;

        initialError =
          typeof errorPayload?.message === "string"
            ? errorPayload.message
            : "Doctor data could not be loaded.";
      } else {
        const payload = (await response.json()) as DoctorsResponse;
        initialDoctors = Array.isArray(payload.doctors) ? payload.doctors : [];
      }
    } catch (error: unknown) {
      console.error("Manage doctors fetch error:", error);
      initialError = "The doctor service is currently unavailable.";
    }
  }

  return (
    <ManageDoctors
      initialDoctors={initialDoctors}
      initialError={initialError}
      readOnly={user.status === "blocked"}
    />
  );
};

export default ManageDoctorsPage;
