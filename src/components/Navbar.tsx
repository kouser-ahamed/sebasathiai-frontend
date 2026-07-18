"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  LuChevronDown,
  LuLayoutDashboard,
  LuLoaderCircle,
  LuLogOut,
  LuMenu,
  LuMoon,
  LuSun,
  LuX,
} from "react-icons/lu";

import NavLink from "./NavLink";

import { authClient } from "@/lib/auth-client";

import { buildLoginHref, isProtectedPathname } from "@/lib/auth-redirect";

interface ProfileAvatarProps {
  src?: string | null;
  name?: string | null;
  sizeClassName: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  name,
  sizeClassName,
}) => {
  const imageSrc = typeof src === "string" && src.trim() ? src.trim() : null;

  const initial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-slate-200/80 shadow-sm dark:bg-black dark:ring-neutral-800 ${sizeClassName}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={name || "User profile"}
          referrerPolicy="no-referrer"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-green-50 text-xs font-bold text-green-700 dark:bg-neutral-900 dark:text-green-400">
          {initial}
        </span>
      )}
    </span>
  );
};

const NAV_LINKS = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Find Doctors",
    href: "/doctors",
  },
  {
    title: "AI Health Assistant",
    href: "/ai-health-assistant",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(true);

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending: sessionPending } = authClient.useSession();

  const user = session?.user;

  /*
   * The current page is included in the Login link.
   * After login, the user returns to this page.
   */
  const loginHref = buildLoginHref(pathname || "/");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      setIsDark(false);

      document.documentElement.classList.remove("dark", "bg-black");

      document.documentElement.classList.add("bg-white");

      document.documentElement.style.colorScheme = "light";

      return;
    }

    setIsDark(true);

    document.documentElement.classList.remove("bg-white");

    document.documentElement.classList.add("dark", "bg-black");

    document.documentElement.style.colorScheme = "dark";

    localStorage.setItem("theme", "dark");
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);

      document.documentElement.classList.remove("dark", "bg-black");

      document.documentElement.classList.add("bg-white");

      document.documentElement.style.colorScheme = "light";

      localStorage.setItem("theme", "light");

      return;
    }

    setIsDark(true);

    document.documentElement.classList.remove("bg-white");

    document.documentElement.classList.add("dark", "bg-black");

    document.documentElement.style.colorScheme = "dark";

    localStorage.setItem("theme", "dark");
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async (): Promise<void> => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    /*
     * window.location includes query parameters.
     * This allows a protected details page to be
     * restored after the next login.
     */
    const currentPage =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : pathname || "/";

    const loggingOutFromProtectedPage = isProtectedPathname(currentPage);

    try {
      await authClient.signOut();

      closeMenus();

      if (loggingOutFromProtectedPage) {
        router.replace(buildLoginHref(currentPage));

        return;
      }

      /*
       * Public page:
       * remain on the same page and only refresh
       * authentication-dependent UI.
       */
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-900 dark:bg-black">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-4">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="relative">
            <Image
              src="/assets/logo11.png"
              alt="SebaSathiAI logo"
              width={42}
              height={42}
              priority
              className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 rounded-full ring-2 ring-green-500/20 transition-all duration-300 group-hover:ring-green-500/40 dark:ring-green-400/20 dark:group-hover:ring-green-400/40" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white sm:text-2xl">
            Seba
            <span className="text-green-600 transition-colors duration-300 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300">
              SathiAI
            </span>
          </h1>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-neutral-200 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.title}</NavLink>
            </li>
          ))}
        </ul>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Desktop theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden cursor-pointer items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-neutral-900 lg:flex"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <LuSun className="text-xl text-amber-400" />
            ) : (
              <LuMoon className="text-xl text-slate-600" />
            )}
          </button>

          {/* Desktop authentication */}
          <div className="hidden items-center lg:flex">
            {sessionPending ? (
              <div className="flex h-10 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-900">
                <LuLoaderCircle className="animate-spin text-green-600 dark:text-green-400" />
              </div>
            ) : !user ? (
              <Link
                href={loginHref}
                className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-green-700 hover:shadow-md dark:bg-green-500 dark:text-black dark:hover:bg-green-400"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((previous) => !previous)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition-all duration-300 ${
                    profileMenuOpen
                      ? "border-green-500 bg-green-50/60 dark:border-green-400 dark:bg-neutral-900"
                      : "border-slate-200 bg-white hover:border-green-500 hover:bg-green-50/30 dark:border-neutral-900 dark:bg-black dark:hover:border-green-400 dark:hover:bg-neutral-900"
                  }`}
                  aria-expanded={profileMenuOpen}
                  aria-label="Open user menu"
                >
                  <ProfileAvatar
                    src={user.image}
                    name={user.name}
                    sizeClassName="size-8"
                  />

                  <span className="max-w-24 truncate text-sm font-semibold text-slate-700 dark:text-neutral-200">
                    {user.name?.split(" ")[0] || "User"}
                  </span>

                  <LuChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 dark:text-neutral-500 ${
                      profileMenuOpen
                        ? "rotate-180 text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  />
                </button>

                {/* Desktop profile dropdown */}
                <div
                  className={`absolute right-0 top-[120%] w-72 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all duration-300 dark:border-neutral-900 dark:bg-black ${
                    profileMenuOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-green-50/40 p-3 dark:border-neutral-900 dark:bg-neutral-950">
                    <div className="relative">
                      <ProfileAvatar
                        src={user.image}
                        name={user.name}
                        sizeClassName="size-11"
                      />

                      <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-green-500 dark:border-black dark:bg-green-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {user.name}
                      </h2>

                      <p className="truncate text-xs text-slate-500 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-1.5 h-px bg-slate-200 dark:bg-neutral-900" />

                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/dashboard"
                      onClick={closeMenus}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActiveLink("/dashboard")
                          ? "bg-green-50 text-green-700 dark:bg-neutral-900 dark:text-green-400"
                          : "text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-neutral-300 dark:hover:bg-neutral-900/70 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg transition-all ${
                          isActiveLink("/dashboard")
                            ? "bg-green-100 text-green-700 dark:bg-neutral-800 dark:text-green-400"
                            : "bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-700 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:bg-neutral-800 dark:group-hover:text-white"
                        }`}
                      >
                        <LuLayoutDashboard size={16} />
                      </span>
                      Dashboard
                    </Link>

                    <div className="my-1 h-px bg-slate-200 dark:bg-neutral-900" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <span className="flex size-8 items-center justify-center rounded-lg bg-red-50 transition-all group-hover:bg-red-100 dark:bg-neutral-900 dark:group-hover:bg-neutral-800">
                        {isLoggingOut ? (
                          <LuLoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <LuLogOut size={16} />
                        )}
                      </span>

                      {isLoggingOut ? "Logging Out" : "Logout"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-neutral-900 lg:hidden"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <LuX size={26} className="text-green-600 dark:text-green-400" />
            ) : (
              <LuMenu
                size={26}
                className="text-green-600 dark:text-green-400"
              />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-x-4 top-[76px] z-[60] max-h-[calc(100dvh-92px)] w-auto max-w-sm overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-neutral-900 dark:bg-black/95 sm:left-auto sm:right-6 sm:w-[calc(100vw-3rem)] lg:hidden ${
            menuOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="p-4 pb-6">
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-green-50/40 p-3 dark:border-neutral-900 dark:bg-neutral-950">
                <div className="relative">
                  <ProfileAvatar
                    src={user.image}
                    name={user.name}
                    sizeClassName="size-10"
                  />

                  <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-green-500 dark:border-black dark:bg-green-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500 dark:text-neutral-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-green-50 text-green-700 shadow-sm dark:bg-neutral-900 dark:text-green-400"
                        : "text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-neutral-200 dark:hover:bg-neutral-900/60 dark:hover:text-green-400"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}

              {user && (
                <Link
                  href="/dashboard"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActiveLink("/dashboard")
                      ? "bg-green-50 text-green-700 shadow-sm dark:bg-neutral-900 dark:text-green-400"
                      : "text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-neutral-200 dark:hover:bg-neutral-900/60 dark:hover:text-green-400"
                  }`}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      isActiveLink("/dashboard")
                        ? "bg-green-100 text-green-700 dark:bg-neutral-800 dark:text-green-400"
                        : "bg-slate-100 text-slate-500 dark:bg-neutral-900 dark:text-slate-400"
                    }`}
                  >
                    <LuLayoutDashboard size={16} />
                  </span>
                  Dashboard
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              {isDark ? (
                <>
                  <LuSun className="text-xl text-amber-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <LuMoon className="text-xl text-slate-600" />
                  Dark Mode
                </>
              )}
            </button>

            <div className="mt-4">
              {sessionPending ? (
                <div className="flex h-11 w-full items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-900">
                  <LuLoaderCircle className="animate-spin text-green-600 dark:text-green-400" />
                </div>
              ) : !user ? (
                <Link
                  href={loginHref}
                  onClick={closeMenus}
                  className="flex h-11 w-full items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 dark:bg-green-500 dark:text-black dark:hover:bg-green-400"
                >
                  Login
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  {isLoggingOut ? (
                    <LuLoaderCircle className="animate-spin" />
                  ) : (
                    <LuLogOut />
                  )}

                  {isLoggingOut ? "Logging Out" : "Logout"}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
