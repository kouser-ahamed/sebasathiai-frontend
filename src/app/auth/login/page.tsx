// "use client";

// import Image from "next/image";
// import Link from "next/link";

// import {
//   Suspense,
//   type ChangeEvent,
//   type FormEvent,
//   useEffect,
//   useState,
// } from "react";

// import { useRouter, useSearchParams } from "next/navigation";

// import {
//   Button,
//   Card,
//   FieldError,
//   Form,
//   Input,
//   Label,
//   TextField,
// } from "@heroui/react";

// import {
//   FiArrowRight,
//   FiCheckCircle,
//   FiHeart,
//   FiLoader,
//   FiLock,
//   FiMail,
//   FiShield,
//   FiUsers,
// } from "react-icons/fi";

// import { GrGoogle } from "react-icons/gr";

// import { toast, ToastContainer } from "react-toastify";

// import "react-toastify/dist/ReactToastify.css";

// import { authClient } from "@/lib/auth-client";

// import { buildSignupHref, getSafeCallbackURL } from "@/lib/auth-redirect";

// const LoginPageContent = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const session = authClient.useSession();

//   const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

//   const registrationCompleted = searchParams.get("registered") === "1";

//   const signupHref = buildSignupHref(callbackURL);

//   const [password, setPassword] = useState<string>("");

//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

//   /*
//    * A logged-in user should not remain on the login page.
//    */
//   useEffect(() => {
//     if (session.data?.user) {
//       router.replace(callbackURL);
//     }
//   }, [callbackURL, router, session.data?.user]);

//   const completeLogin = () => {
//     toast.success("Login successful", {
//       position: "top-right",
//       autoClose: 1200,
//     });

//     window.setTimeout(() => {
//       router.replace(callbackURL);
//       router.refresh();
//     }, 500);
//   };

//   const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setErrorMessage("");
//     setIsSubmitting(true);

//     try {
//       const form = event.currentTarget;

//       const email = (
//         form.elements.namedItem("email") as HTMLInputElement
//       ).value.trim();

//       const passwordValue = (
//         form.elements.namedItem("password") as HTMLInputElement
//       ).value;

//       const absoluteCallbackURL = new URL(
//         callbackURL,
//         window.location.origin,
//       ).toString();

//       const { error } = await authClient.signIn.email({
//         email,
//         password: passwordValue,
//         rememberMe: true,
//         callbackURL: absoluteCallbackURL,
//       });

//       if (error) {
//         setErrorMessage(
//           error.message || "Invalid email or password. Please try again.",
//         );

//         return;
//       }

//       completeLogin();
//     } catch {
//       setErrorMessage(
//         "Something went wrong while signing in. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleGoogleSignIn = async (): Promise<void> => {
//     setErrorMessage("");
//     setIsGoogleLoading(true);

//     try {
//       const absoluteCallbackURL = new URL(
//         callbackURL,
//         window.location.origin,
//       ).toString();

//       const { error } = await authClient.signIn.social({
//         provider: "google",
//         callbackURL: absoluteCallbackURL,
//       });

//       if (error) {
//         setErrorMessage(
//           error.message || "Google sign-in could not be started.",
//         );

//         setIsGoogleLoading(false);
//       }
//     } catch {
//       setErrorMessage("Google sign-in could not be started. Please try again.");

//       setIsGoogleLoading(false);
//     }
//   };

//   const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setPassword(event.target.value);
//   };

//   return (
//     <main className="relative flex h-dvh min-h-dvh items-center overflow-hidden bg-[#FBEFEF] px-3 py-3 dark:bg-[#211B27] sm:px-5 lg:px-8">
//       <ToastContainer />

//       {/* Background glow */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(197,179,211,0.55),transparent_32%),radial-gradient(circle_at_92%_18%,rgba(255,226,226,0.8),transparent_30%),radial-gradient(circle_at_82%_88%,rgba(245,203,203,0.6),transparent_32%)] dark:bg-[radial-gradient(circle_at_8%_12%,rgba(197,179,211,0.16),transparent_32%),radial-gradient(circle_at_92%_18%,rgba(255,226,226,0.08),transparent_30%),radial-gradient(circle_at_82%_88%,rgba(245,203,203,0.1),transparent_32%)]" />

//       <div className="relative mx-auto grid h-full max-h-190 w-full max-w-6xl overflow-hidden rounded-[32px] border border-[#F5CBCB] bg-white/95 shadow-[0_38px_110px_-48px_rgba(112,86,126,0.42)] backdrop-blur-xl dark:border-[#51415D] dark:bg-[#2A2233]/95 lg:grid-cols-[0.92fr_1.08fr]">
//         {/* Left information panel */}
//         <section className="relative hidden overflow-hidden bg-linear-to-br from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] p-10 text-slate-900 lg:flex lg:flex-col lg:justify-between">
//           <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#FBEFEF]/70 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-white/45 blur-3xl" />

//           <div className="relative">
//             <Link href="/" className="inline-flex items-center gap-3">
//               <Image
//                 src="/assets/logo11.png"
//                 alt="SebaSathi AI logo"
//                 width={52}
//                 height={52}
//                 priority
//                 className="size-13 rounded-full border-2 border-white/60 object-cover"
//               />

//               <div>
//                 <p className="text-2xl font-black">
//                   Seba
//                   <span className="text-[#614E70]">Sathi AI</span>
//                 </p>

//                 <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700/70">
//                   Intelligent Healthcare Access
//                 </p>
//               </div>
//             </Link>

//             <h1 className="mt-12 text-4xl font-black leading-tight">
//               Welcome Back to SebaSathi AI
//             </h1>

//             <p className="mt-5 max-w-md text-sm font-medium leading-8 text-slate-700/85">
//               Sign in to connect with verified doctors, manage appointments and
//               access intelligent healthcare guidance from one secure place.
//             </p>

//             <div className="mt-9 space-y-5">
//               <div className="flex items-start gap-4">
//                 <FiHeart className="mt-1 shrink-0 text-xl text-rose-700" />

//                 <div>
//                   <h2 className="font-black">Patient-Centred Care</h2>

//                   <p className="mt-1 text-sm leading-6 text-slate-700/75">
//                     Find the right doctor and request consultation easily.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FiShield className="mt-1 shrink-0 text-xl text-[#614E70]" />

//                 <div>
//                   <h2 className="font-black">Secure Health Support</h2>

//                   <p className="mt-1 text-sm leading-6 text-slate-700/75">
//                     Access appointments, consultation support and digital
//                     healthcare services safely.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FiUsers className="mt-1 shrink-0 text-xl text-[#745D83]" />

//                 <div>
//                   <h2 className="font-black">AI Health Assistant</h2>

//                   <p className="mt-1 text-sm leading-6 text-slate-700/75">
//                     Get preliminary symptom guidance and suitable department
//                     suggestions.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <p className="relative mt-12 text-xs font-medium text-slate-700/65">
//             AI guidance is informational and does not replace consultation with
//             a qualified medical professional.
//           </p>
//         </section>

//         {/* Login form */}
//         <section className="flex h-full items-center justify-center p-4 sm:p-6 lg:p-8">
//           <Card className="w-full max-w-lg border-0 bg-transparent p-0 shadow-none">
//             <div className="text-center">
//               <Link
//                 href="/"
//                 className="inline-flex items-center gap-3 lg:hidden"
//               >
//                 <Image
//                   src="/assets/logo11.png"
//                   alt="SebaSathi AI logo"
//                   width={48}
//                   height={48}
//                   priority
//                   className="size-12 rounded-full object-cover"
//                 />

//                 <p className="text-2xl font-black text-slate-900 dark:text-white">
//                   Seba
//                   <span className="text-[#745D83] dark:text-[#E4D6EE]">
//                     Sathi AI
//                   </span>
//                 </p>
//               </Link>

//               <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#745D83] dark:text-[#E4D6EE] lg:mt-0">
//                 Secure Account Access
//               </p>

//               <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
//                 Sign In to SebaSathi AI
//               </h1>

//               <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-slate-600 dark:text-[#D8CADA]">
//                 Continue to your healthcare dashboard and services.
//               </p>
//             </div>

//             {registrationCompleted && (
//               <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#C5B3D3] bg-[#FBEFEF] px-4 py-3 text-[#614E70] dark:border-[#6B5878] dark:bg-[#3B3045] dark:text-[#E4D6EE]">
//                 <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />

//                 <p className="text-sm font-semibold leading-6">
//                   Registration completed successfully. Sign in to continue to
//                   your previous page.
//                 </p>
//               </div>
//             )}

//             {callbackURL !== "/" && (
//               <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#F5CBCB] bg-[#FFE2E2]/70 px-4 py-3 text-[#765454] dark:border-[#765454] dark:bg-[#412F35] dark:text-[#F5CBCB]">
//                 <FiArrowRight className="mt-0.5 shrink-0 text-lg" />

//                 <p className="text-sm font-semibold leading-6">
//                   After login, you will automatically return to the page you
//                   were visiting.
//                 </p>
//               </div>
//             )}

//             {errorMessage && (
//               <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-400">
//                 {errorMessage}
//               </div>
//             )}

//             <Form
//               className="mt-7 flex flex-col gap-5"
//               onSubmit={onSubmit}
//               onReset={() => {
//                 setPassword("");
//                 setErrorMessage("");
//               }}
//             >
//               <TextField isRequired name="email" type="email">
//                 <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Email Address
//                 </Label>

//                 <div className="relative mt-2">
//                   <FiMail className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="john@example.com"
//                     autoComplete="email"
//                     className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
//                   />
//                 </div>

//                 <FieldError />
//               </TextField>

//               <TextField
//                 isRequired
//                 minLength={8}
//                 name="password"
//                 type="password"
//               >
//                 <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Password
//                 </Label>

//                 <div className="relative mt-2">
//                   <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="Enter your password"
//                     autoComplete="current-password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                     className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
//                   />
//                 </div>

//                 <FieldError />
//               </TextField>

//               <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
//                 <Button
//                   type="submit"
//                   isDisabled={isSubmitting || isGoogleLoading}
//                   className="group h-12 w-full rounded-2xl bg-linear-to-r from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] font-bold text-slate-900 shadow-lg shadow-[#C5B3D3]/35 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#C5B3D3]/45 dark:from-[#8F789F] dark:via-[#B8848E] dark:to-[#CFA4A4] dark:text-white"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <FiLoader className="animate-spin" />
//                       Signing In
//                     </>
//                   ) : (
//                     <>
//                       Sign In
//                       <FiArrowRight className="transition-transform group-hover:translate-x-1" />
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   type="reset"
//                   isDisabled={isSubmitting || isGoogleLoading}
//                   className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A]"
//                 >
//                   Reset
//                 </Button>
//               </div>
//             </Form>

//             <div className="my-7 flex items-center gap-4">
//               <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />

//               <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A83A8] dark:text-[#C5B3D3]">
//                 Or
//               </span>

//               <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />
//             </div>

//             <Button
//               type="button"
//               isDisabled={isSubmitting || isGoogleLoading}
//               onPress={handleGoogleSignIn}
//               className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] hover:text-[#614E70] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A] dark:hover:text-[#FFE2E2]"
//             >
//               {isGoogleLoading ? (
//                 <FiLoader className="animate-spin" />
//               ) : (
//                 <GrGoogle className="text-lg" />
//               )}
//               Continue with Google
//             </Button>

//             <p className="mt-7 text-center text-sm font-medium text-slate-500 dark:text-[#D8CADA]">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href={signupHref}
//                 className="font-extrabold text-[#745D83] transition-colors hover:text-[#614E70] dark:text-[#F5CBCB] dark:hover:text-[#FFE2E2]"
//               >
//                 Create an account
//               </Link>
//             </p>
//           </Card>
//         </section>
//       </div>
//     </main>
//   );
// };

// const LoginPageFallback = () => {
//   return (
//     <main className="flex h-dvh min-h-dvh items-center justify-center bg-[#FBEFEF] dark:bg-[#211B27]">
//       <div className="flex items-center gap-3 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
//         <FiLoader className="animate-spin text-xl" />
//         Loading login page...
//       </div>
//     </main>
//   );
// };

// export default function SignInPage() {
//   return (
//     <Suspense fallback={<LoginPageFallback />}>
//       <LoginPageContent />
//     </Suspense>
//   );
// }













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
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-[#FBEFEF] px-3 py-6 dark:bg-[#211B27] sm:px-5 lg:px-8">
      <ToastContainer />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(197,179,211,0.55),transparent_32%),radial-gradient(circle_at_92%_18%,rgba(255,226,226,0.8),transparent_30%),radial-gradient(circle_at_82%_88%,rgba(245,203,203,0.6),transparent_32%)] dark:bg-[radial-gradient(circle_at_8%_12%,rgba(197,179,211,0.16),transparent_32%),radial-gradient(circle_at_92%_18%,rgba(255,226,226,0.08),transparent_30%),radial-gradient(circle_at_82%_88%,rgba(245,203,203,0.1),transparent_32%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-[#F5CBCB] bg-white/95 shadow-[0_38px_110px_-48px_rgba(112,86,126,0.42)] backdrop-blur-xl dark:border-[#51415D] dark:bg-[#2A2233]/95 lg:h-full lg:max-h-190 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left information panel */}
        <section className="relative hidden overflow-hidden bg-linear-to-br from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] p-10 text-slate-900 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#FBEFEF]/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-white/45 blur-3xl" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/final1.png"
                alt="SebaSathi AI logo"
                width={52}
                height={52}
                priority
                className="size-13 rounded-full border-2 border-white/60 object-cover"
              />

              <div>
                <p className="text-2xl font-black">
                  Seba
                  <span className="text-[#614E70]">Sathi AI</span>
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700/70">
                  Intelligent Healthcare Access
                </p>
              </div>
            </Link>

            <h1 className="mt-12 text-4xl font-black leading-tight">
              Welcome Back to SebaSathi AI
            </h1>

            <p className="mt-5 max-w-md text-sm font-medium leading-8 text-slate-700/85">
              Sign in to connect with verified doctors, manage appointments and
              access intelligent healthcare guidance from one secure place.
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex items-start gap-4">
                <FiHeart className="mt-1 shrink-0 text-xl text-rose-700" />

                <div>
                  <h2 className="font-black">Patient-Centred Care</h2>

                  <p className="mt-1 text-sm leading-6 text-slate-700/75">
                    Find the right doctor and request consultation easily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiShield className="mt-1 shrink-0 text-xl text-[#614E70]" />

                <div>
                  <h2 className="font-black">Secure Health Support</h2>

                  <p className="mt-1 text-sm leading-6 text-slate-700/75">
                    Access appointments, consultation support and digital
                    healthcare services safely.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiUsers className="mt-1 shrink-0 text-xl text-[#745D83]" />

                <div>
                  <h2 className="font-black">AI Health Assistant</h2>

                  <p className="mt-1 text-sm leading-6 text-slate-700/75">
                    Get preliminary symptom guidance and suitable department
                    suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-12 text-xs font-medium text-slate-700/65">
            AI guidance is informational and does not replace consultation with
            a qualified medical professional.
          </p>
        </section>

        {/* Login form */}
        <section className="flex w-full min-w-0 items-center justify-center p-4 sm:p-6 lg:h-full lg:p-8">
          <Card className="w-full max-w-lg border-0 bg-transparent p-0 shadow-none">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-3 lg:hidden"
              >
                <Image
                  src="/assets/final1.png"
                  alt="SebaSathi AI logo"
                  width={48}
                  height={48}
                  priority
                  className="size-12 rounded-full object-cover"
                />

                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  Seba
                  <span className="text-[#745D83] dark:text-[#E4D6EE]">
                    Sathi AI
                  </span>
                </p>
              </Link>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#745D83] dark:text-[#E4D6EE] lg:mt-0">
                Secure Account Access
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Sign In to SebaSathi AI
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-slate-600 dark:text-[#D8CADA]">
                Continue to your healthcare dashboard and services.
              </p>
            </div>

            {registrationCompleted && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#C5B3D3] bg-[#FBEFEF] px-4 py-3 text-[#614E70] dark:border-[#6B5878] dark:bg-[#3B3045] dark:text-[#E4D6EE]">
                <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />

                <p className="text-sm font-semibold leading-6">
                  Registration completed successfully. Sign in to continue to
                  your previous page.
                </p>
              </div>
            )}

            {callbackURL !== "/" && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#F5CBCB] bg-[#FFE2E2]/70 px-4 py-3 text-[#765454] dark:border-[#765454] dark:bg-[#412F35] dark:text-[#F5CBCB]">
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
                <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Email Address
                </Label>

                <div className="relative mt-2">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
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
                <Label className="text-sm font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Password
                </Label>

                <div className="relative mt-2">
                  <FiLock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-4 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
                  />
                </div>

                <FieldError />
              </TextField>

              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <Button
                  type="submit"
                  isDisabled={isSubmitting || isGoogleLoading}
                  className="group h-12 w-full rounded-2xl bg-linear-to-r from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] font-bold text-slate-900 shadow-lg shadow-[#C5B3D3]/35 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#C5B3D3]/45 dark:from-[#8F789F] dark:via-[#B8848E] dark:to-[#CFA4A4] dark:text-white"
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
                  className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A]"
                >
                  Reset
                </Button>
              </div>
            </Form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />

              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A83A8] dark:text-[#C5B3D3]">
                Or
              </span>

              <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />
            </div>

            <Button
              type="button"
              isDisabled={isSubmitting || isGoogleLoading}
              onPress={handleGoogleSignIn}
              className="h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] hover:text-[#614E70] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A] dark:hover:text-[#FFE2E2]"
            >
              {isGoogleLoading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <GrGoogle className="text-lg" />
              )}
              Continue with Google
            </Button>

            <p className="mt-7 text-center text-sm font-medium text-slate-500 dark:text-[#D8CADA]">
              Don&apos;t have an account?{" "}
              <Link
                href={signupHref}
                className="font-extrabold text-[#745D83] transition-colors hover:text-[#614E70] dark:text-[#F5CBCB] dark:hover:text-[#FFE2E2]"
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
    <main className="flex h-dvh min-h-dvh items-center justify-center bg-[#FBEFEF] dark:bg-[#211B27]">
      <div className="flex items-center gap-3 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
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







