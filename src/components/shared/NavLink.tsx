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
      className={`relative border-b-2 pb-1 font-semibold transition-all duration-200 ${
        isActive
          ? "border-[#745D83] text-[#614E70] dark:border-[#F5CBCB] dark:text-[#FFE2E2]"
          : "border-transparent text-slate-700 hover:border-[#C5B3D3] hover:text-[#745D83] dark:text-[#D8CADA] dark:hover:border-[#C5B3D3] dark:hover:text-[#F5CBCB]"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
