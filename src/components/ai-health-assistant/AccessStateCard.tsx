"use client";

import Link from "next/link";
import { LuLockKeyhole, LuShieldAlert, LuStethoscope } from "react-icons/lu";

import type { AIHealthAccessState } from "./types";

interface AccessStateCardProps {
  state: Exclude<AIHealthAccessState, "allowed" | "loading">;
  message: string;
}

const AccessStateCard = ({ state, message }: AccessStateCardProps) => {
  const Icon =
    state === "guest"
      ? LuLockKeyhole
      : state === "blocked"
        ? LuShieldAlert
        : LuStethoscope;

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-[#F5CBCB] bg-white p-6 text-center shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
        <Icon className="size-8" />
      </span>

      <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
        {state === "guest"
          ? "Sign-in required"
          : state === "blocked"
            ? "AI access is currently blocked"
            : "AI Health Assistant unavailable"}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-[#A997AE]">
        {message}
      </p>

      {state === "guest" && (
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#745D83] px-6 text-sm font-black text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27]"
        >
          Sign in
        </Link>
      )}
    </section>
  );
};

export default AccessStateCard;