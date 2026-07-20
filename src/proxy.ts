import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";


export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const originalPage = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    const loginURL = request.nextUrl.clone();

    loginURL.pathname = "/auth/login";
    loginURL.search = "";
    loginURL.searchParams.set(
      "callbackURL",
      originalPage,
    );

    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
   "/dashboard",
   "/dashboard/patient",
   "/dashboard/patient/appointments",
   "/dashboard/patient/prescriptions",
   "/dashboard/patient/consultations",
   "/dashboard/patient/ai-health-history",
   "/dashboard/patient/my-profile",
   "/dashboard/doctor",
   "/dashboard/doctor/patients-appointments",
   "/dashboard/doctor/patients",
   "/dashboard/doctor/prescriptions",
   "/dashboard/doctor/consultations",
   "/dashboard/doctor/availability",
   "/dashboard/doctor/my-profile",
   "/dashboard/admin",
   "/dashboard/admin/users",
   "/dashboard/admin/doctors",
   "/dashboard/admin/appointments",
   "/dashboard/admin/my-profile",
  ],
};