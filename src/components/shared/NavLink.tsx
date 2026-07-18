"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`border-b-2 pb-1 font-semibold transition-all duration-200 ${
        isActive
          ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
          : "border-transparent text-slate-700 hover:border-emerald-500/50 hover:text-emerald-700 dark:text-neutral-200 dark:hover:border-emerald-400/60 dark:hover:text-emerald-400"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
