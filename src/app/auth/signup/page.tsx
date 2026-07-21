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
//   FiImage,
//   FiLoader,
//   FiLock,
//   FiMail,
//   FiShield,
//   FiUser,
//   FiUserPlus,
//   FiUsers,
// } from "react-icons/fi";

// import { GrGoogle } from "react-icons/gr";

// import { toast, ToastContainer } from "react-toastify";

// import "react-toastify/dist/ReactToastify.css";

// import PasswordChecklist from "@/components/shared/PasswordChecklist";

// import { authClient } from "@/lib/auth-client";

// import { buildLoginHref, getSafeCallbackURL } from "@/lib/auth-redirect";

// const SignupPageContent = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const session = authClient.useSession();

//   const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

//   const loginHref = buildLoginHref(callbackURL);

//   const [password, setPassword] = useState<string>("");

//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

//   useEffect(() => {
//     if (session.data?.user) {
//       router.replace(callbackURL);
//     }
//   }, [callbackURL, router, session.data?.user]);

//   const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setErrorMessage("");

//     const form = event.currentTarget;

//     const name = (
//       form.elements.namedItem("name") as HTMLInputElement
//     ).value.trim();

//     const image = (
//       form.elements.namedItem("image") as HTMLInputElement
//     ).value.trim();

//     const email = (
//       form.elements.namedItem("email") as HTMLInputElement
//     ).value.trim();

//     const passwordValue = (
//       form.elements.namedItem("password") as HTMLInputElement
//     ).value;

//     if (name.length < 2) {
//       setErrorMessage("Please enter a valid full name.");

//       return;
//     }

//     if (passwordValue.length < 8) {
//       setErrorMessage("Password must contain at least 8 characters.");

//       return;
//     }

//     if (!/[A-Z]/.test(passwordValue)) {
//       setErrorMessage("Password must contain at least one uppercase letter.");

//       return;
//     }

//     if (!/[a-z]/.test(passwordValue)) {
//       setErrorMessage("Password must contain at least one lowercase letter.");

//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const { error } = await authClient.signUp.email({
//         name,
//         email,
//         password: passwordValue,
//         image: image || undefined,
//       });

//       if (error) {
//         setErrorMessage(
//           error.message || "Registration failed. Please try again.",
//         );

//         return;
//       }

//       try {
//         await authClient.signOut();
//       } catch {
//         // No action is needed when no active session exists.
//       }

//       toast.success("Registration successful. Please sign in.", {
//         position: "top-right",
//         autoClose: 1200,
//       });

//       form.reset();
//       setPassword("");

//       const loginURL = new URL(loginHref, window.location.origin);

//       loginURL.searchParams.set("registered", "1");

//       window.setTimeout(() => {
//         router.replace(`${loginURL.pathname}${loginURL.search}`);
//       }, 700);
//     } catch {
//       setErrorMessage(
//         "Something went wrong during registration. Please try again.",
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
//           error.message || "Google registration could not be started.",
//         );

//         setIsGoogleLoading(false);
//       }
//     } catch {
//       setErrorMessage(
//         "Google registration could not be started. Please try again.",
//       );

//       setIsGoogleLoading(false);
//     }
//   };

//   const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setPassword(event.target.value);
//   };

//   return (
//     <main className="relative flex h-dvh min-h-dvh items-center overflow-hidden bg-[#FBEFEF] px-3 py-3 transition-colors duration-300 dark:bg-[#211B27] sm:px-5 lg:px-8">
//       <ToastContainer />

//       {/* Soft background glow */}
//       <div className="pointer-events-none absolute -left-28 -top-24 size-96 rounded-full bg-[#C5B3D3]/50 blur-3xl dark:bg-[#C5B3D3]/12" />

//       <div className="pointer-events-none absolute -bottom-32 -right-24 size-107.5 rounded-full bg-[#F5CBCB]/55 blur-3xl dark:bg-[#F5CBCB]/10" />

//       <div className="signup-shell relative mx-auto grid h-full max-h-190 w-full max-w-6xl overflow-hidden rounded-[30px] border border-[#F5CBCB] bg-white/90 shadow-[0_32px_95px_-48px_rgba(112,86,126,0.42)] backdrop-blur-2xl dark:border-[#51415D] dark:bg-[#2A2233]/95 lg:grid-cols-[0.88fr_1.12fr]">
//         {/* Left information panel */}
//         <section className="relative hidden overflow-hidden bg-linear-to-br from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] p-7 text-slate-900 lg:flex lg:flex-col lg:justify-between xl:p-9">
//           <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#FBEFEF]/70 blur-3xl" />

//           <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-white/45 blur-3xl" />

//           <div className="relative">
//             <Link href="/" className="inline-flex items-center gap-3">
//               <Image
//                 src="/assets/logo11.png"
//                 alt="SebaSathi AI logo"
//                 width={48}
//                 height={48}
//                 priority
//                 className="size-12 rounded-full border-2 border-white/60 object-cover shadow-lg"
//               />

//               <div>
//                 <p className="text-xl font-black tracking-tight">
//                   SebaSathi
//                   <span className="text-[#614E70]">AI</span>
//                 </p>

//                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700/70">
//                   Intelligent Healthcare Support
//                 </p>
//               </div>
//             </Link>

//             <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#614E70] backdrop-blur-md">
//               <FiUserPlus />
//               Create Your Account
//             </div>

//             <h1 className="mt-5 max-w-sm text-3xl font-black leading-tight xl:text-4xl">
//               Start Your Smarter Healthcare Journey
//             </h1>

//             <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-700/80">
//               Create your SebaSathi AI account to find trusted doctors, manage
//               consultations and access helpful AI-assisted health guidance.
//             </p>

//             <div className="mt-7 grid gap-3">
//               <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
//                 <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-rose-700">
//                   <FiHeart />
//                 </span>

//                 <div>
//                   <h2 className="text-sm font-black">
//                     Personalized Care Access
//                   </h2>

//                   <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
//                     Find healthcare support based on your needs.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
//                 <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-[#614E70]">
//                   <FiShield />
//                 </span>

//                 <div>
//                   <h2 className="text-sm font-black">
//                     Secure Health Experience
//                   </h2>

//                   <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
//                     Keep consultations and account access safely connected.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
//                 <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-[#745D83]">
//                   <FiUsers />
//                 </span>

//                 <div>
//                   <h2 className="text-sm font-black">Connect with Doctors</h2>

//                   <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
//                     Discover doctors and request care from one place.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <p className="relative mt-5 border-t border-white/50 pt-4 text-[11px] font-medium leading-5 text-slate-700/65">
//             Registration is free and keeps your healthcare experience securely
//             connected to your account.
//           </p>
//         </section>

//         {/* Registration form */}
//         <section className="relative flex min-h-0 items-center justify-center overflow-hidden p-3 sm:p-5 lg:p-6 xl:p-8">
//           <div className="pointer-events-none absolute right-0 top-0 size-44 rounded-full bg-[#C5B3D3]/25 blur-3xl dark:bg-[#C5B3D3]/8" />

//           <Card className="relative w-full max-w-2xl border-0 bg-transparent p-0 shadow-none">
//             <div className="text-center">
//               <Link
//                 href="/"
//                 className="inline-flex items-center gap-2 lg:hidden"
//               >
//                 <Image
//                   src="/assets/logo11.png"
//                   alt="SebaSathi AI logo"
//                   width={40}
//                   height={40}
//                   priority
//                   className="size-10 rounded-full object-cover shadow-sm"
//                 />

//                 <p className="text-xl font-black text-slate-900 dark:text-white">
//                   SebaSathi AI
//                 </p>
//               </Link>

//               <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#745D83] dark:text-[#E4D6EE] lg:mt-0">
//                 Create Your Account
//               </p>

//               <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
//                 Join the SebaSathi AI Community
//               </h1>

//               <p className="mx-auto mt-1.5 max-w-md text-xs font-medium leading-5 text-slate-600 dark:text-[#D8CADA] sm:text-sm">
//                 Register now and sign in to continue to your previous page.
//               </p>
//             </div>

//             {callbackURL !== "/" && (
//               <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#F5CBCB] bg-[#FFE2E2]/70 px-3 py-2 text-[#765454] dark:border-[#765454] dark:bg-[#412F35] dark:text-[#F5CBCB]">
//                 <FiArrowRight className="mt-0.5 shrink-0 text-sm" />

//                 <p className="text-xs font-semibold leading-5">
//                   Your previous page has been saved. After registration, sign in
//                   to return there.
//                 </p>
//               </div>
//             )}

//             {errorMessage && (
//               <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-400">
//                 {errorMessage}
//               </div>
//             )}

//             <Form
//               className="mt-4 grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2"
//               onSubmit={onSubmit}
//               onReset={() => {
//                 setPassword("");
//                 setErrorMessage("");
//               }}
//             >
//               <TextField isRequired name="name" type="text">
//                 <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Full Name
//                 </Label>

//                 <div className="relative mt-1">
//                   <FiUser className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
//                   />
//                 </div>

//                 <FieldError />
//               </TextField>

//               <TextField name="image" type="url">
//                 <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Profile Image URL{" "}
//                   <span className="font-medium text-slate-400 dark:text-[#A997AE]">
//                     (optional)
//                   </span>
//                 </Label>

//                 <div className="relative mt-1">
//                   <FiImage className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="https://example.com/image.jpg"
//                     autoComplete="photo"
//                     className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
//                   />
//                 </div>

//                 <FieldError />
//               </TextField>

//               <TextField isRequired name="email" type="email">
//                 <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Email Address
//                 </Label>

//                 <div className="relative mt-1">
//                   <FiMail className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="john@example.com"
//                     autoComplete="email"
//                     className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
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
//                 <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
//                   Password
//                 </Label>

//                 <div className="relative mt-1">
//                   <FiLock className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

//                   <Input
//                     placeholder="Create a strong password"
//                     autoComplete="new-password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                     className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
//                   />
//                 </div>

//                 <div className="-mb-1 -mt-1 origin-top scale-[0.88]">
//                   <PasswordChecklist password={password} />
//                 </div>

//                 <FieldError />
//               </TextField>

//               <div className="grid grid-cols-2 gap-2 sm:col-span-2">
//                 <Button
//                   type="submit"
//                   isDisabled={isSubmitting || isGoogleLoading}
//                   className="group h-10 w-full rounded-xl bg-linear-to-r from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] text-sm font-bold text-slate-900 shadow-md shadow-[#C5B3D3]/35 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C5B3D3]/45 dark:from-[#8F789F] dark:via-[#B8848E] dark:to-[#CFA4A4] dark:text-white"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <FiLoader className="animate-spin" />
//                       Registering
//                     </>
//                   ) : (
//                     <>
//                       <FiUserPlus />
//                       Register
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   type="reset"
//                   isDisabled={isSubmitting || isGoogleLoading}
//                   className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A]"
//                 >
//                   Reset
//                 </Button>
//               </div>
//             </Form>

//             <div className="my-3 flex items-center gap-3">
//               <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />

//               <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9A83A8] dark:text-[#C5B3D3]">
//                 Or
//               </span>

//               <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />
//             </div>

//             <Button
//               type="button"
//               isDisabled={isSubmitting || isGoogleLoading}
//               onPress={handleGoogleSignIn}
//               className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] hover:text-[#614E70] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A] dark:hover:text-[#FFE2E2]"
//             >
//               {isGoogleLoading ? (
//                 <FiLoader className="animate-spin" />
//               ) : (
//                 <GrGoogle className="text-base" />
//               )}
//               Continue with Google
//             </Button>

//             <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#C5B3D3] bg-[#FBEFEF] px-3 py-2 dark:border-[#6B5878] dark:bg-[#3B3045]">
//               <FiCheckCircle className="mt-0.5 shrink-0 text-sm text-[#745D83] dark:text-[#F5CBCB]" />

//               <p className="text-[11px] font-medium leading-5 text-slate-500 dark:text-[#D8CADA]">
//                 After email registration, you will return to the Login page.
//                 Login with your new account to continue to your original page.
//               </p>
//             </div>

//             <p className="mt-3 text-center text-xs font-medium text-slate-500 dark:text-[#D8CADA]">
//               Already have an account?{" "}
//               <Link
//                 href={loginHref}
//                 className="font-extrabold text-[#745D83] transition-colors hover:text-[#614E70] dark:text-[#F5CBCB] dark:hover:text-[#FFE2E2]"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </Card>
//         </section>
//       </div>

//       <style jsx>{`
//         @media (max-height: 720px) {
//           .signup-shell {
//             transform: scale(0.94);
//           }
//         }

//         @media (max-height: 650px) {
//           .signup-shell {
//             transform: scale(0.86);
//           }
//         }

//         @media (max-height: 590px) {
//           .signup-shell {
//             transform: scale(0.78);
//           }
//         }
//       `}</style>
//     </main>
//   );
// };

// const SignupPageFallback = () => {
//   return (
//     <main className="flex h-dvh min-h-dvh items-center justify-center overflow-hidden bg-[#FBEFEF] dark:bg-[#211B27]">
//       <div className="flex items-center gap-3 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
//         <FiLoader className="animate-spin text-xl" />
//         Loading registration page...
//       </div>
//     </main>
//   );
// };

// export default function SignUpPage() {
//   return (
//     <Suspense fallback={<SignupPageFallback />}>
//       <SignupPageContent />
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
  FiImage,
  FiLoader,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import { GrGoogle } from "react-icons/gr";

import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import PasswordChecklist from "@/components/shared/PasswordChecklist";

import { authClient } from "@/lib/auth-client";

import { buildLoginHref, getSafeCallbackURL } from "@/lib/auth-redirect";

const SignupPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const session = authClient.useSession();

  const callbackURL = getSafeCallbackURL(searchParams.get("callbackURL"));

  const loginHref = buildLoginHref(callbackURL);

  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session.data?.user) {
      router.replace(callbackURL);
    }
  }, [callbackURL, router, session.data?.user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    const form = event.currentTarget;

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();

    const image = (
      form.elements.namedItem("image") as HTMLInputElement
    ).value.trim();

    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();

    const passwordValue = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    if (name.length < 2) {
      setErrorMessage("Please enter a valid full name.");

      return;
    }

    if (passwordValue.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");

      return;
    }

    if (!/[A-Z]/.test(passwordValue)) {
      setErrorMessage("Password must contain at least one uppercase letter.");

      return;
    }

    if (!/[a-z]/.test(passwordValue)) {
      setErrorMessage("Password must contain at least one lowercase letter.");

      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password: passwordValue,
        image: image || undefined,
      });

      if (error) {
        setErrorMessage(
          error.message || "Registration failed. Please try again.",
        );

        return;
      }

      try {
        await authClient.signOut();
      } catch {
        // No action is needed when no active session exists.
      }

      toast.success("Registration successful. Please sign in.", {
        position: "top-right",
        autoClose: 1200,
      });

      form.reset();
      setPassword("");

      const loginURL = new URL(loginHref, window.location.origin);

      loginURL.searchParams.set("registered", "1");

      window.setTimeout(() => {
        router.replace(`${loginURL.pathname}${loginURL.search}`);
      }, 700);
    } catch {
      setErrorMessage(
        "Something went wrong during registration. Please try again.",
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
          error.message || "Google registration could not be started.",
        );

        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage(
        "Google registration could not be started. Please try again.",
      );

      setIsGoogleLoading(false);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-[#FBEFEF] px-3 py-6 transition-colors duration-300 dark:bg-[#211B27] sm:px-5 lg:px-8">
      <ToastContainer />

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-28 -top-24 size-96 rounded-full bg-[#C5B3D3]/50 blur-3xl dark:bg-[#C5B3D3]/12" />

      <div className="pointer-events-none absolute -bottom-32 -right-24 size-107.5 rounded-full bg-[#F5CBCB]/55 blur-3xl dark:bg-[#F5CBCB]/10" />

      <div className="signup-shell relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-[#F5CBCB] bg-white/90 shadow-[0_32px_95px_-48px_rgba(112,86,126,0.42)] backdrop-blur-2xl dark:border-[#51415D] dark:bg-[#2A2233]/95 lg:h-full lg:max-h-190 lg:grid-cols-[0.88fr_1.12fr]">
        {/* Left information panel */}
        <section className="relative hidden overflow-hidden bg-linear-to-br from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] p-7 text-slate-900 lg:flex lg:flex-col lg:justify-between xl:p-9">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#FBEFEF]/70 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-white/45 blur-3xl" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/final1.png"
                alt="SebaSathi AI logo"
                width={48}
                height={48}
                priority
                className="size-12 rounded-full border-2 border-white/60 object-cover shadow-lg"
              />

              <div>
                <p className="text-xl font-black tracking-tight">
                  SebaSathi
                  <span className="text-[#614E70]">AI</span>
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700/70">
                  Intelligent Healthcare Support
                </p>
              </div>
            </Link>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#614E70] backdrop-blur-md">
              <FiUserPlus />
              Create Your Account
            </div>

            <h1 className="mt-5 max-w-sm text-3xl font-black leading-tight xl:text-4xl">
              Start Your Smarter Healthcare Journey
            </h1>

            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-700/80">
              Create your SebaSathi AI account to find trusted doctors, manage
              consultations and access helpful AI-assisted health guidance.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-rose-700">
                  <FiHeart />
                </span>

                <div>
                  <h2 className="text-sm font-black">
                    Personalized Care Access
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
                    Find healthcare support based on your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-[#614E70]">
                  <FiShield />
                </span>

                <div>
                  <h2 className="text-sm font-black">
                    Secure Health Experience
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
                    Keep consultations and account access safely connected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/25 p-3.5 backdrop-blur-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFEF]/80 text-[#745D83]">
                  <FiUsers />
                </span>

                <div>
                  <h2 className="text-sm font-black">Connect with Doctors</h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-700/75">
                    Discover doctors and request care from one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-5 border-t border-white/50 pt-4 text-[11px] font-medium leading-5 text-slate-700/65">
            Registration is free and keeps your healthcare experience securely
            connected to your account.
          </p>
        </section>

        {/* Registration form */}
        <section className="relative flex w-full min-w-0 items-center justify-center overflow-x-hidden p-3 sm:p-5 lg:h-full lg:p-6 xl:p-8">
          <div className="pointer-events-none absolute right-0 top-0 size-44 rounded-full bg-[#C5B3D3]/25 blur-3xl dark:bg-[#C5B3D3]/8" />

          <Card className="relative w-full max-w-2xl border-0 bg-transparent p-0 shadow-none">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 lg:hidden"
              >
                <Image
                  src="/assets/final1.png"
                  alt="SebaSathi AI logo"
                  width={40}
                  height={40}
                  priority
                  className="size-10 rounded-full object-cover shadow-sm"
                />

                <p className="text-xl font-black text-slate-900 dark:text-white">
                  SebaSathi AI
                </p>
              </Link>

              <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#745D83] dark:text-[#E4D6EE] lg:mt-0">
                Create Your Account
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Join the SebaSathi AI Community
              </h1>

              <p className="mx-auto mt-1.5 max-w-md text-xs font-medium leading-5 text-slate-600 dark:text-[#D8CADA] sm:text-sm">
                Register now and sign in to continue to your previous page.
              </p>
            </div>

            {callbackURL !== "/" && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#F5CBCB] bg-[#FFE2E2]/70 px-3 py-2 text-[#765454] dark:border-[#765454] dark:bg-[#412F35] dark:text-[#F5CBCB]">
                <FiArrowRight className="mt-0.5 shrink-0 text-sm" />

                <p className="text-xs font-semibold leading-5">
                  Your previous page has been saved. After registration, sign in
                  to return there.
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMessage}
              </div>
            )}

            <Form
              className="mt-4 grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2"
              onSubmit={onSubmit}
              onReset={() => {
                setPassword("");
                setErrorMessage("");
              }}
            >
              <TextField isRequired name="name" type="text">
                <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Full Name
                </Label>

                <div className="relative mt-1">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
                  />
                </div>

                <FieldError />
              </TextField>

              <TextField name="image" type="url">
                <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Profile Image URL{" "}
                  <span className="font-medium text-slate-400 dark:text-[#A997AE]">
                    (optional)
                  </span>
                </Label>

                <div className="relative mt-1">
                  <FiImage className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="https://example.com/image.jpg"
                    autoComplete="photo"
                    className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
                  />
                </div>

                <FieldError />
              </TextField>

              <TextField isRequired name="email" type="email">
                <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Email Address
                </Label>

                <div className="relative mt-1">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
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
                <Label className="text-xs font-bold text-slate-700 dark:text-[#E7DDE8]">
                  Password
                </Label>

                <div className="relative mt-1">
                  <FiLock className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-[#9A83A8] dark:text-[#C5B3D3]" />

                  <Input
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-[#C5B3D3] focus:border-[#9A83A8] focus:ring-3 focus:ring-[#C5B3D3]/30 dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-white dark:placeholder:text-[#A997AE] dark:hover:border-[#C5B3D3] dark:focus:border-[#F5CBCB] dark:focus:ring-[#C5B3D3]/20"
                  />
                </div>

                <div className="-mb-1 -mt-1 origin-top scale-[0.88]">
                  <PasswordChecklist password={password} />
                </div>

                <FieldError />
              </TextField>

              <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                <Button
                  type="submit"
                  isDisabled={isSubmitting || isGoogleLoading}
                  className="group h-10 w-full rounded-xl bg-linear-to-r from-[#C5B3D3] via-[#F5CBCB] to-[#FFE2E2] text-sm font-bold text-slate-900 shadow-md shadow-[#C5B3D3]/35 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C5B3D3]/45 dark:from-[#8F789F] dark:via-[#B8848E] dark:to-[#CFA4A4] dark:text-white"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Registering
                    </>
                  ) : (
                    <>
                      <FiUserPlus />
                      Register
                    </>
                  )}
                </Button>

                <Button
                  type="reset"
                  isDisabled={isSubmitting || isGoogleLoading}
                  className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A]"
                >
                  Reset
                </Button>
              </div>
            </Form>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9A83A8] dark:text-[#C5B3D3]">
                Or
              </span>

              <div className="h-px flex-1 bg-[#F5CBCB] dark:bg-[#5D4C69]" />
            </div>

            <Button
              type="button"
              isDisabled={isSubmitting || isGoogleLoading}
              onPress={handleGoogleSignIn}
              className="h-10 w-full rounded-xl border border-[#E4D5E7] bg-white text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C5B3D3] hover:bg-[#FBEFEF] hover:text-[#614E70] dark:border-[#5D4C69] dark:bg-[#352B3D] dark:text-[#E7DDE8] dark:hover:border-[#C5B3D3] dark:hover:bg-[#41354A] dark:hover:text-[#FFE2E2]"
            >
              {isGoogleLoading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <GrGoogle className="text-base" />
              )}
              Continue with Google
            </Button>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#C5B3D3] bg-[#FBEFEF] px-3 py-2 dark:border-[#6B5878] dark:bg-[#3B3045]">
              <FiCheckCircle className="mt-0.5 shrink-0 text-sm text-[#745D83] dark:text-[#F5CBCB]" />

              <p className="text-[11px] font-medium leading-5 text-slate-500 dark:text-[#D8CADA]">
                After email registration, you will return to the Login page.
                Login with your new account to continue to your original page.
              </p>
            </div>

            <p className="mt-3 text-center text-xs font-medium text-slate-500 dark:text-[#D8CADA]">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="font-extrabold text-[#745D83] transition-colors hover:text-[#614E70] dark:text-[#F5CBCB] dark:hover:text-[#FFE2E2]"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </section>
      </div>

      <style jsx>{`
        @media (max-height: 720px) and (min-width: 1024px) {
          .signup-shell {
            transform: scale(0.94);
          }
        }

        @media (max-height: 650px) and (min-width: 1024px) {
          .signup-shell {
            transform: scale(0.86);
          }
        }

        @media (max-height: 590px) and (min-width: 1024px) {
          .signup-shell {
            transform: scale(0.78);
          }
        }
      `}</style>
    </main>
  );
};

const SignupPageFallback = () => {
  return (
    <main className="flex h-dvh min-h-dvh items-center justify-center overflow-hidden bg-[#FBEFEF] dark:bg-[#211B27]">
      <div className="flex items-center gap-3 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
        <FiLoader className="animate-spin text-xl" />
        Loading registration page...
      </div>
    </main>
  );
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupPageContent />
    </Suspense>
  );
}
