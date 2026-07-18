"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowRightFromSquare,
  House,
  LayoutSideContentLeft,
  SquareChartBar,
} from "@gravity-ui/icons";

import { Drawer } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

type DashboardRole =
  | "admin"
  | "patient"
  | "doctor";

interface DashboardUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
}

interface DashboardSideBarProps {
  user: DashboardUser;
}

interface DashboardNavItem {
  label: string;
  href: string;
  icon: typeof House;
  exact?: boolean;
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

const DashboardSideBar = ({
  user,
}: DashboardSideBarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] =
    useState<boolean>(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState<boolean>(false);

  const role = getDashboardRole(user?.role);
  const roleTitle = getRoleTitle(role);

  const dashboardHref: Record<
    DashboardRole,
    string
  > = {
    admin: "/dashboard/admin",
    doctor: "/dashboard/doctor",
    patient: "/dashboard/patient",
  };

  /*
   * For now, every role has only Home and Dashboard.
   * More role-specific pages can be added later.
   */
  const navItems: DashboardNavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: House,
      exact: true,
    },
    {
      label: `${roleTitle} Dashboard`,
      href: dashboardHref[role],
      icon: SquareChartBar,
    },
  ];

  const isActiveLink = (
    item: DashboardNavItem,
  ): boolean => {
    if (item.exact) {
      return pathname === item.href;
    }

    return (
      pathname === item.href ||
      pathname.startsWith(
        `${item.href}/`,
      )
    );
  };

  const closeDrawer = (): void => {
    setIsOpen(false);
  };

  const handleLogout =
    async (): Promise<void> => {
      if (isLoggingOut) {
        return;
      }

      setIsLoggingOut(true);

      try {
        await authClient.signOut();

        closeDrawer();

        router.replace("/auth/signin");
        router.refresh();
      } finally {
        setIsLoggingOut(false);
      }
    };

  const userInitial =
    user?.name
      ?.trim()
      .charAt(0)
      .toUpperCase() || "U";

  const navContent = (
    <nav className="flex min-h-full flex-col">
      {/* Logo */}
      <Link
        href="/"
        onClick={closeDrawer}
        className="group flex items-center gap-2.5 rounded-2xl px-2 py-2"
      >
        <div className="relative shrink-0">
          <Image
            src="/assets/logo11.png"
            alt="SebaSathi AI logo"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#C5B3D3]/50 transition-all duration-300 group-hover:ring-[#745D83]/70 dark:ring-[#F5CBCB]/30 dark:group-hover:ring-[#F5CBCB]/60" />
        </div>

        <h1 className="text-xl font-black tracking-tight">
          <span className="text-slate-900 dark:text-white">
            Seba
          </span>

          <span className="text-[#745D83] transition-colors duration-300 group-hover:text-[#614E70] dark:text-[#F5CBCB] dark:group-hover:text-[#FFE2E2]">
            Sathi AI
          </span>
        </h1>
      </Link>

      {/* User profile */}
      <div className="my-4 border-y border-[#F5CBCB] py-4 dark:border-[#41354A]">
        <div className="flex items-center gap-3 rounded-2xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
          <div className="relative shrink-0">
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#C5B3D3] bg-white text-sm font-bold text-[#745D83] shadow-sm dark:border-[#745D83] dark:bg-[#211B27] dark:text-[#F5CBCB]">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={
                    user?.name ||
                    "User profile"
                  }
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                userInitial
              )}
            </span>

            <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-[#745D83] dark:border-[#352B3D] dark:bg-[#F5CBCB]" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {user?.name || "User"}
            </h2>

            {user?.email && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#A997AE]">
                {user.email}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[#C5B3D3] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#614E70] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB]">
                {role}
              </span>

              {user?.status ===
                "blocked" && (
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Blocked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => {
          const active =
            isActiveLink(item);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeDrawer}
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "border-[#C5B3D3] bg-[#FBEFEF] text-[#614E70] shadow-sm shadow-[#C5B3D3]/20 dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                  : "border-transparent text-slate-600 hover:border-[#F5CBCB] hover:bg-[#FFE2E2]/60 hover:text-[#745D83] dark:text-[#D8CADA] dark:hover:border-[#5D4C69] dark:hover:bg-[#352B3D] dark:hover:text-[#FFE2E2]"
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                  active
                    ? "bg-[#FFE2E2] text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB]"
                    : "bg-[#FBEFEF] text-[#745D83] group-hover:bg-[#F5CBCB]/60 dark:bg-[#2A2233] dark:text-[#C5B3D3] dark:group-hover:bg-[#41354A]"
                }`}
              >
                <Icon className="h-5 w-5 text-current" />
              </span>

              <span className="truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-5 border-t border-[#F5CBCB] pt-4 dark:border-[#41354A]">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/25 px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <ArrowRightFromSquare className="h-5 w-5" />

          {isLoggingOut
            ? "Logging Out..."
            : "Logout"}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-dvh w-72 shrink-0 overflow-y-auto border-r border-[#F5CBCB] bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#41354A] dark:bg-[#2A2233] lg:block">
        {navContent}
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-xl border border-[#C5B3D3] bg-white px-3 py-2 text-sm font-semibold text-[#614E70] shadow-lg shadow-[#C5B3D3]/20 transition-all duration-200 hover:bg-[#FBEFEF] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D] lg:hidden"
        aria-label="Open dashboard menu"
      >
        <LayoutSideContentLeft className="h-5 w-5" />
        Menu
      </button>

      {/* Mobile drawer */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Drawer.Backdrop className="bg-black/40 backdrop-blur-sm">
          <Drawer.Content
            placement="left"
            className="w-[88vw] max-w-72 border-r border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233]"
          >
            <Drawer.Dialog>
              <Drawer.CloseTrigger />

              <Drawer.Body className="p-4">
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
};

export default DashboardSideBar;