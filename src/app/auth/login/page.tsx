"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Suspense,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import {
  FiArrowRight,
  FiCheckCircle,
  FiHeart,
  FiLoader,
  FiLock,
  FiMail,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import { GrGoogle } from "react-icons/gr";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { authClient } from "@/lib/auth-client";

import { buildSignupHref, getSafeCallbackURL } from "@/lib/auth-redirect";

const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const session = authClient.useSession();

  const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

  const registrationCompleted = searchParams.get("registered") === "1";

  const signupHref = buildSignupHref(callbackURL);

  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  /*
   * A logged-in user should not remain on the login page.
   */
  useEffect(() => {
    if (session.data?.user) {
      router.replace(callbackURL);
    }
  }, [callbackURL, router, session.data?.user]);

  const completeLogin = () => {
    toast.success("Login successful", {
      position: "top-right",
      autoClose: 1200,
    });

    window.setTimeout(() => {
      router.replace(callbackURL);
      router.refresh();
    }, 500);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;

      const email = (
        form.elements.namedItem("email") as HTMLInputElement
      ).value.trim();

      const passwordValue = (
        form.elements.namedItem("password") as HTMLInputElement
      ).value;

      const absoluteCallbackURL = new URL(
        callbackURL,
        window.location.origin,
      ).toString();

      const { error } = await authClient.signIn.email({
        email,
        password: passwordValue,
        rememberMe: true,
        callbackURL: absoluteCallbackURL,
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password. Please try again.",
        );

        return;
      }

      completeLogin();
    } catch {
      setErrorMessage(
        "Something went wrong while signing in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      const absoluteCallbackURL = new URL(
        callbackURL,
        window.location.origin,
      ).toString();

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: absoluteCallbackURL,
      });

      if (error) {
        setErrorMessage(
          error.message || "Google sign-in could not be started.",
        );

        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Google sign-in could not be started. Please try again.");

      setIsGoogleLoading(false);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f6f7ff] px-4 py-10 dark:bg-[#070816] sm:px-6 sm:py-14 lg:px-8">
      <ToastContainer />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(99,102,241,0.20),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_82%_88%,rgba(6,182,212,0.16),transparent_30%)] dark:bg-[radial-gradient(circle_at_8%_12%,rgba(99,102,241,0.13),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(168,85,247,0.09),transparent_28%),radial-gradient(circle_at_82%_88%,rgba(6,182,212,0.09),transparent_30%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-indigo-100 bg-white/95 shadow-[0_38px_110px_-48px_rgba(79,70,229,0.45)] backdrop-blur-xl dark:border-indigo-950 dark:bg-[#0d1022]/95 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left information panel */}
        <section className="relative hidden overflow-hidden bg-linear-to-br from-indigo-950 via-violet-900 to-cyan-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/logo11.png"
                alt="SebaSathi AI logo"
                width={52}
                height={52}
                priority
                className="size-13 rounded-full border-2 border-white/20 object-cover"
              />

              <div>
                <p className="text-2xl font-black">
                  Seba
                  <span className="text-cyan-300">Sathi AI</span>
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100/70">
                  Intelligent Healthcare Access
                </p>
              </div>
            </Link>

            <h1 className="mt-12 text-4xl font-black leading-tight">
              Welcome Back to SebaSathi AI
            </h1>

            <p className="mt-5 max-w-md text-sm font-medium leading-8 text-indigo-50/80">
              Sign in to connect with verified doctors, manage appointments and
              access intelligent healthcare guidance from one secure place.
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex items-start gap-4">
                <FiHeart className="mt-1 shrink-0 text-xl text-pink-300" />

                <div>
                  <h2 className="font-black">Patient-Centred Care</h2>

                  <p className="mt-1 text-sm leading-6 text-indigo-50/70">
                    Find the right doctor and request consultation easily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiShield className="mt-1 shrink-0 text-xl text-sky-300" />

                <div>
                  <h2 className="font-black">Secure Health Support</h2>

                  <p className="mt-1 text-sm leading-6 text-indigo-50/70">
                    Access appointments, consultation support and digital
                    healthcare services safely.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiUsers className="mt-1 shrink-0 text-xl text-violet-300" />

                <div>
                  <h2 className="font-black">AI Health Assistant</h2>

                  <p className="mt-1 text-sm leading-6 text-indigo-50/70">
                    Get preliminary symptom guidance and suitable department
                    suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-12 text-xs font-medium text-indigo-100/60">
            AI guidance is informational and does not replace consultation with
            a qualified medical professional.
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <Card className="w-full max-w-lg border-0 bg-transparent p-0 shadow-none">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-3 lg:hidden"
              >
                <Image
                  src="/assets/logo11.png"
                  alt="SebaSathi AI logo"
                  width={48}
                  height={48}
                  priority
                  className="size-12 rounded-full object-cover"
                />

                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  Seba
                  <span className="text-indigo-600 dark:text-cyan-300">
                    Sathi AI
                  </span>
                </p>
              </Link>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600 dark:text-cyan-300 lg:mt-0">
                Secure Account Access
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Sign In to SebaSathi AI
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-slate-600 dark:text-zinc-400">
                Continue to your healthcare dashboard and services.
              </p>
            </div>

            {registrationCompleted && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-300">
                <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />

                <p className="text-sm font-semibold leading-6">
                  Registration completed successfully. Sign in to continue to
                  your previous page.
                </p>
              </div>
            )}

            {callbackURL !== "/" && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-400">
                <FiArrowRight className="mt-0.5 shrink-0 text-lg" />

                <p className="text-sm font-semibold leading-6">
                  After login, you will automatically return to the page you
                  were visiting.
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMessage}
              </div>
            )}

            <Form
              className="mt-7 flex flex-col gap-5"
              onSubmit={onSubmit}
              onReset={() => {
                setPassword("");
                setErrorMessage("");
              }}
            >
              <TextField isRequired name="email" type="email">
                <Label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  Email Address
                </Label>

                <div className="relative mt-2">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

                  <Input
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-indigo-950 dark:bg-[#11152b] dark:text-white dark:placeholder:text-slate-600 dark:hover:border-indigo-700 dark:focus:border-cyan-400 dark:focus:ring-cyan-950/60"
                  />
                </div>

                <FieldError />
              </TextField>

              <TextField
                isRequired
                minLength={8}
                name="password"
                type="password"
              >
                <Label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  Password
                </Label>

                <div className="relative mt-2">
                  <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

                  <Input
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-indigo-950 dark:bg-[#11152b] dark:text-white dark:placeholder:text-slate-600 dark:hover:border-indigo-700 dark:focus:border-cyan-400 dark:focus:ring-cyan-950/60"
                  />
                </div>

                <FieldError />
              </TextField>

              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <Button
                  type="submit"
                  isDisabled={isSubmitting || isGoogleLoading}
                  className="group h-12 w-full rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-cyan-500 font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25 dark:from-indigo-500 dark:via-violet-500 dark:to-cyan-400 dark:text-white"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Signing In
                    </>
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <Button
                  type="reset"
                  isDisabled={isSubmitting || isGoogleLoading}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  Reset
                </Button>
              </div>
            </Form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />

              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-zinc-600">
                Or
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
            </div>

            <Button
              type="button"
              isDisabled={isSubmitting || isGoogleLoading}
              onPress={handleGoogleSignIn}
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-950 dark:bg-[#11152b] dark:text-slate-300 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20 dark:hover:text-cyan-300"
            >
              {isGoogleLoading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <GrGoogle className="text-lg" />
              )}
              Continue with Google
            </Button>

            <p className="mt-7 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href={signupHref}
                className="font-extrabold text-indigo-700 transition-colors hover:text-violet-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                Create an account
              </Link>
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
};

const LoginPageFallback = () => {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f6f7ff] dark:bg-[#070816]">
      <div className="flex items-center gap-3 text-sm font-bold text-indigo-700 dark:text-cyan-300">
        <FiLoader className="animate-spin text-xl" />
        Loading login page...
      </div>
    </main>
  );
};

export default function SignInPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
