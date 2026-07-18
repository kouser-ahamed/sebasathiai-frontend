"use client";

import { useEffect, useState } from "react";

type DashboardRole = "admin" | "patient" | "doctor";

interface DashboardUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
}

interface DashboardNavbarProps {
  user: DashboardUser;
}

const getDashboardRole = (
  role?: string | null,
): DashboardRole => {
  if (
    role === "admin" ||
    role === "doctor" ||
    role === "patient"
  ) {
    return role;
  }

  return "patient";
};

const getRoleTitle = (
  role: DashboardRole,
): string => {
  const roleTitles: Record<
    DashboardRole,
    string
  > = {
    admin: "Admin",
    doctor: "Doctor",
    patient: "Patient",
  };

  return roleTitles[role];
};

const DashboardNavbar = ({
  user,
}: DashboardNavbarProps) => {
  /*
   * The greeting is set after the component mounts.
   * This prevents server/client time differences from
   * causing a hydration mismatch.
   */
  const [greeting, setGreeting] =
    useState<string>("Welcome");

  useEffect(() => {
    const currentHour =
      new Date().getHours();

    if (currentHour < 12) {
      setGreeting("Good Morning");
      return;
    }

    if (currentHour < 18) {
      setGreeting("Good Afternoon");
      return;
    }

    setGreeting("Good Evening");
  }, []);

  const role = getDashboardRole(user?.role);
  const roleTitle = getRoleTitle(role);

  return (
    <header className="shrink-0 border-b border-[#F5CBCB] bg-white px-4 pb-5 pt-16 shadow-sm transition-colors duration-300 dark:border-[#41354A] dark:bg-[#2A2233] sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-[#CDBFD0]">
          {greeting},{" "}
          <span className="font-semibold text-[#745D83] dark:text-[#F5CBCB]">
            {user?.name || "User"}
          </span>
          !
        </p>

        <h1 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          {roleTitle}{" "}
          <span className="bg-gradient-to-r from-[#614E70] via-[#9A83A8] to-[#B8848E] bg-clip-text text-transparent dark:from-[#F5CBCB] dark:via-[#C5B3D3] dark:to-[#FFE2E2]">
            Dashboard
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-[#D8CADA]">
          Here&apos;s what&apos;s happening in
          your healthcare dashboard today.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <div className="rounded-full border border-[#C5B3D3] bg-[#FBEFEF] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#614E70] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            {role} panel
          </div>

          {user?.status === "blocked" && (
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
              Blocked
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;