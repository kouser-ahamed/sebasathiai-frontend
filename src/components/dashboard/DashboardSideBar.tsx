"use client";

import type { ComponentType } from "react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ArrowRightFromSquare,
  BookOpen,
  Calendar,
  Comment,
  FilePlus,
  GearDot,
  House,
  LayoutSideContentLeft,
  Paperclip,
  PersonPlus,
  PersonsLock,
  PersonWorker,
  ShieldCheck,
  SquareChartBar,
  Star,
} from "@gravity-ui/icons";

import { Drawer } from "@heroui/react";

import { authClient } from "@/lib/auth-client";

type DashboardRole = "admin" | "patient" | "doctor";

interface DashboardUser {
  id?: string;
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
}

interface DashboardSideBarProps {
  user: DashboardUser;
}

type DashboardIcon = ComponentType<{
  className?: string;
}>;

interface DashboardNavItem {
  label: string;
  href: string;
  icon: DashboardIcon;
}

const isDashboardRole = (
  role: unknown,
): role is DashboardRole => {
  return (
    role === "admin" ||
    role === "patient" ||
    role === "doctor"
  );
};

const dashboardItems: Record<
  DashboardRole,
  DashboardNavItem[]
> = {
  patient: [
    {
      label: "Home",
      href: "/",
      icon: House,
    },
    {
      label: "Overview",
      href: "/dashboard/patient",
      icon: SquareChartBar,
    },
    {
      label: "My Appointments",
      href: "/dashboard/patient/appointments",
      icon: Calendar,
    },
    {
      label: "Prescriptions",
      href: "/dashboard/patient/prescriptions",
      icon: FilePlus,
    },
    {
      label: "Consultations",
      href: "/dashboard/patient/consultations",
      icon: Comment,
    },
    {
      label: "AI Health History",
      href: "/dashboard/patient/ai-health-history",
      icon: BookOpen,
    },
    {
      label: "My Profile",
      href: "/dashboard/patient/my-profile",
      icon: GearDot,
    },
  ],

  doctor: [
    {
      label: "Home",
      href: "/",
      icon: House,
    },
    {
      label: "Overview",
      href: "/dashboard/doctor",
      icon: SquareChartBar,
    },
    {
      label: "Appointments",
      href: "/dashboard/doctor/patients-appointments",
      icon: Calendar,
    },
    {
      label: "My Patients",
      href: "/dashboard/doctor/patients",
      icon: PersonsLock,
    },
    {
      label: "Prescriptions",
      href: "/dashboard/doctor/prescriptions",
      icon: FilePlus,
    },
    {
      label: "Consultation Records",
      href: "/dashboard/doctor/consultations",
      icon: Paperclip,
    },
    {
      label: "Availability",
      href: "/dashboard/doctor/availability",
      icon: Calendar,
    },
    {
      label: "My Profile",
      href: "/dashboard/doctor/my-profile",
      icon: GearDot,
    },
  ],

  admin: [
    {
      label: "Home",
      href: "/",
      icon: House,
    },
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: ShieldCheck,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: PersonsLock,
    },
    {
      label: "Manage Doctors",
      href: "/dashboard/admin/doctors",
      icon: PersonWorker,
    },
   
    {
      label: "Manage Appointments",
      href: "/dashboard/admin/appointments",
      icon: Calendar,
    },  
    {
      label: "My Profile",
      href: "/dashboard/admin/my-profile",
      icon: GearDot,
    },
  ],
};

const getActiveDashboardHref = (
  pathname: string,
  navItems: DashboardNavItem[],
): string | null => {
  const matchingItems = navItems.filter((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    return (
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
    );
  });

  if (matchingItems.length === 0) {
    return null;
  }

  return matchingItems.sort(
    (firstItem, secondItem) =>
      secondItem.href.length -
      firstItem.href.length,
  )[0].href;
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

  const role: DashboardRole =
    isDashboardRole(user?.role)
      ? user.role
      : "patient";

  const navItems = dashboardItems[role];

  const closeSidebar = (): void => {
    setIsOpen(false);
  };

  const activeHref = getActiveDashboardHref(
    pathname,
    navItems,
  );

  const handleLogout =
    async (): Promise<void> => {
      if (isLoggingOut) {
        return;
      }

      setIsLoggingOut(true);

      try {
        await authClient.signOut();

        closeSidebar();

        router.replace("/");
        router.refresh();
      } catch (error: unknown) {
        console.error(
          "Dashboard logout error:",
          error,
        );
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
        onClick={closeSidebar}
        className="group flex items-center gap-2.5 rounded-2xl px-2 py-2"
      >
        <div className="relative shrink-0">
          <Image
            src="/assets/logo11.png"
            alt="SebaSathi AI logo"
            width={44}
            height={44}
            priority
            className="size-11 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
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

      {/* User information */}
      <div className="my-4 border-y border-[#F5CBCB] py-4 dark:border-[#41354A]">
        <div className="flex items-center gap-3 rounded-2xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
          <div className="relative shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || "User"}
                width={48}
                height={48}
                referrerPolicy="no-referrer"
                unoptimized
                className="size-12 rounded-full border-2 border-[#C5B3D3] object-cover dark:border-[#745D83]"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-full border-2 border-[#C5B3D3] bg-white text-sm font-black text-[#745D83] dark:border-[#745D83] dark:bg-[#211B27] dark:text-[#F5CBCB]">
                {userInitial}
              </span>
            )}

            <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[#FBEFEF] bg-[#745D83] dark:border-[#352B3D] dark:bg-[#F5CBCB]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {user?.name || "User"}
            </h3>

            {user?.email && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#A997AE]">
                {user.email}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[#C5B3D3] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#614E70] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB]">
                {role}
              </span>

              {user?.status === "blocked" && (
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Blocked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard navigation */}
      <div className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => {
          const active =
            item.href === activeHref;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              aria-current={
                active ? "page" : undefined
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

      {/* Mobile sidebar button */}
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