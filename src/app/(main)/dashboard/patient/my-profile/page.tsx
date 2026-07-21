"use client";

import { type FormEvent, useState } from "react";

import {
  Button,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import { FiLock, FiLoader, FiShield } from "react-icons/fi";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { authClient } from "@/lib/auth-client";

const MyProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    const form = event.currentTarget;

    const currentPassword = (
      form.elements.namedItem("currentPassword") as HTMLInputElement
    ).value;

    const newPassword = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    ).value;

    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage(
        "New password must be different from the current password.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setErrorMessage(
          error.message ||
            "Password could not be changed. Please try again.",
        );
        return;
      }

      toast.success("Password changed successfully.", {
        position: "top-right",
        autoClose: 1500,
      });

      form.reset();
    } catch {
      setErrorMessage(
        "Something went wrong while changing the password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <ToastContainer />

      <h1 className="text-2xl font-black text-slate-950 dark:text-white">
        My Profile
      </h1>

      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-[#A997AE]">
        Manage your account security.
      </p>

      <div className="mt-6 rounded-3xl border border-[#F5CBCB] bg-white p-6 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            <FiShield className="size-5" />
          </span>

          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              Change Password
            </h2>

            <p className="text-xs font-medium text-slate-500 dark:text-[#A997AE]">
              Enter your current password to set a new one.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-400">
            {errorMessage}
          </div>
        )}

        <Form className="mt-6 flex flex-col gap-5" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="currentPassword"
            type="password"
          >
            <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
              Current Password
            </Label>

            <div className="relative mt-2">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

              <Input
                placeholder="Enter your current password"
                autoComplete="current-password"
                className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
              />
            </div>
          </TextField>

          <TextField
            isRequired
            minLength={8}
            name="newPassword"
            type="password"
          >
            <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
              New Password
            </Label>

            <div className="relative mt-2">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

              <Input
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
              />
            </div>
          </TextField>

          <TextField
            isRequired
            minLength={8}
            name="confirmPassword"
            type="password"
          >
            <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
              Confirm New Password
            </Label>

            <div className="relative mt-2">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

              <Input
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
              />
            </div>
          </TextField>

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="group mt-2 h-12 w-full rounded-2xl bg-linear-to-r from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] font-bold text-slate-900 shadow-lg shadow-[#C5B3D3]/35 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#C5B3D3]/45 dark:from-[#8F789F] dark:via-[#B8848E] dark:to-[#CFA4A4] dark:text-white"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" />
                Changing Password
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </Form>

        <p className="mt-4 text-center text-xs font-medium text-slate-400 dark:text-[#A997AE]">
          Changing your password will sign you out of all other devices.
        </p>
      </div>
    </div>
  );
};

export default MyProfilePage;