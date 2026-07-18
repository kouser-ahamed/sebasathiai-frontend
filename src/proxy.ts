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
   "/share-food/:path*",
   "/my-shared-foods/:path*",
   "/my-requests/:path*",
   "/request-send/:path*",
   "/incoming-food-requests/:path*",
  ],
};