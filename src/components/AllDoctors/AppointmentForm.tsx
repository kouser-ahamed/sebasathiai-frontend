// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";
// import {
//   LuArrowLeft,
//   LuCalendarCheck,
//   LuClock3,
//   LuHospital,
//   LuStethoscope,
// } from "react-icons/lu";

// import MessageModal from "./MessageModal";
// import { submitAppointment } from "./public-api";

// import type { AppointmentFormValues, CurrentUser, Doctor } from "./types";

// interface AppointmentFormProps {
//   doctor: Doctor;
//   currentUser: CurrentUser | null;
// }

// const inputClass =
//   "h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#745D83] focus:ring-4 focus:ring-[#C5B3D3]/20 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white";

// const AppointmentForm = ({ doctor, currentUser }: AppointmentFormProps) => {
//   const router = useRouter();
//   const [values, setValues] = useState<AppointmentFormValues>({
//     patientName: currentUser?.name || "",
//     phone: "",
//     address: "",
//     problemTitle: "",
//     symptomsDescription: "",
//     appointmentDate: "",
//     appointmentTime: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [modal, setModal] = useState({
//     open: false,
//     title: "",
//     message: "",
//     success: false,
//   });

//   const update = (field: keyof AppointmentFormValues, value: string) =>
//     setValues((current) => ({ ...current, [field]: value }));

//   const submit = async (event: FormEvent) => {
//     event.preventDefault();

//     if (!currentUser?.id) {
//       router.push(
//         `/auth/signin?callbackUrl=${encodeURIComponent(`/doctors/${doctor.id}/appointment`)}`,
//       );
//       return;
//     }

//     if (currentUser.role !== "patient") {
//       setModal({
//         open: true,
//         title: "Patient appointment only",
//         message: "Only a patient account can submit an appointment request.",
//         success: false,
//       });
//       return;
//     }

//     if (currentUser.status === "blocked") {
//       setModal({
//         open: true,
//         title: "Appointment restricted",
//         message:
//           "You are restricted by the administrator and cannot take an appointment.",
//         success: false,
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await submitAppointment(doctor.id, values);
//       setModal({
//         open: true,
//         title: "Appointment submitted",
//         message: response.message,
//         success: true,
//       });
//     } catch (error: unknown) {
//       setModal({
//         open: true,
//         title: "Appointment could not be submitted",
//         message: error instanceof Error ? error.message : "Please try again.",
//         success: false,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#FFF9F9] py-10 dark:bg-[#211B27]">
//       <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
//         <Link
//           href={`/doctors/${doctor.id}`}
//           className="inline-flex items-center gap-2 text-sm font-black text-[#745D83] dark:text-[#F5CBCB]"
//         >
//           <LuArrowLeft className="size-4" /> Back to doctor details
//         </Link>

//         <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
//           <header className="bg-gradient-to-r from-[#FBEFEF] to-[#FFE2E2] p-6 dark:from-[#352B3D] dark:to-[#41354A] sm:p-8">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//               <div className="flex size-20 items-center justify-center overflow-hidden rounded-3xl bg-white text-3xl font-black text-[#745D83] shadow-sm dark:bg-[#211B27] dark:text-[#F5CBCB]">
//                 {doctor.image ? (
//                   <img
//                     src={doctor.image}
//                     alt={doctor.name}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   doctor.name.charAt(0)
//                 )}
//               </div>
//               <div>
//                 <p className="text-xs font-black uppercase tracking-wider text-[#745D83] dark:text-[#F5CBCB]">
//                   Free appointment request
//                 </p>
//                 <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
//                   {doctor.name}
//                 </h1>
//                 <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-[#CDBFD0]">
//                   <LuStethoscope className="size-4" /> {doctor.specialization}
//                 </p>
//                 <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-[#A997AE]">
//                   <LuHospital className="size-4" /> {doctor.hospital}
//                 </p>
//               </div>
//             </div>
//           </header>

//           <form
//             onSubmit={submit}
//             className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
//           >
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Patient Name
//               <input
//                 required
//                 value={values.patientName}
//                 onChange={(event) => update("patientName", event.target.value)}
//                 className={inputClass}
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Email
//               <input
//                 value={currentUser?.email || ""}
//                 readOnly
//                 className={`${inputClass} cursor-not-allowed opacity-70`}
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Phone
//               <input
//                 required
//                 value={values.phone}
//                 onChange={(event) => update("phone", event.target.value)}
//                 className={inputClass}
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Address
//               <input
//                 required
//                 value={values.address}
//                 onChange={(event) => update("address", event.target.value)}
//                 className={inputClass}
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8] sm:col-span-2">
//               Health Problem / Symptoms Title
//               <input
//                 required
//                 value={values.problemTitle}
//                 onChange={(event) => update("problemTitle", event.target.value)}
//                 placeholder="Example: Fever and breathing difficulty"
//                 className={inputClass}
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8] sm:col-span-2">
//               Describe all symptoms
//               <textarea
//                 required
//                 rows={6}
//                 maxLength={5000}
//                 value={values.symptomsDescription}
//                 onChange={(event) =>
//                   update("symptomsDescription", event.target.value)
//                 }
//                 placeholder="Describe when the symptoms started, severity, medicines taken, allergies and other important details..."
//                 className="w-full rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
//               />
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Appointment Date
//               <div className="relative">
//                 <LuCalendarCheck className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#745D83]" />
//                 <input
//                   required
//                   type="date"
//                   min={new Date().toISOString().slice(0, 10)}
//                   value={values.appointmentDate}
//                   onChange={(event) =>
//                     update("appointmentDate", event.target.value)
//                   }
//                   className={`${inputClass} pl-12`}
//                 />
//               </div>
//             </label>
//             <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
//               Schedule Time
//               <div className="relative">
//                 <LuClock3 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#745D83]" />
//                 <input
//                   required
//                   type="time"
//                   value={values.appointmentTime}
//                   onChange={(event) =>
//                     update("appointmentTime", event.target.value)
//                   }
//                   className={`${inputClass} pl-12`}
//                 />
//               </div>
//             </label>
//             <div className="sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="h-12 w-full rounded-2xl bg-[#745D83] text-sm font-black text-white disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]"
//               >
//                 {isSubmitting
//                   ? "Submitting Appointment..."
//                   : "Submit Appointment Form"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <MessageModal
//         isOpen={modal.open}
//         title={modal.title}
//         message={modal.message}
//         onClose={() => {
//           setModal((current) => ({ ...current, open: false }));
//           if (modal.success) router.push("/dashboard/patient/appointments");
//         }}
//       />
//     </main>
//   );
// };

// export default AppointmentForm;

















"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  LuArrowLeft,
  LuCalendarCheck,
  LuClock3,
  LuHospital,
  LuStethoscope,
} from "react-icons/lu";

import MessageModal from "./MessageModal";
import { submitAppointment } from "./public-api";

import type { AppointmentFormValues, CurrentUser, Doctor } from "./types";

interface AppointmentFormProps {
  doctor: Doctor;
  currentUser: CurrentUser | null;
}

const inputClass =
  "h-12 w-full rounded-2xl border border-[#E4D5E7] bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#745D83] focus:ring-4 focus:ring-[#C5B3D3]/20 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white";

const AppointmentForm = ({ doctor, currentUser }: AppointmentFormProps) => {
  const router = useRouter();
  const [values, setValues] = useState<AppointmentFormValues>({
    patientName: currentUser?.name || "",
    phone: "",
    address: "",
    problemTitle: "",
    symptomsDescription: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    success: false,
  });

  const update = (field: keyof AppointmentFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentUser?.id) {
      router.push(
        `/auth/login?callbackURL=${encodeURIComponent(`/find-doctors/${doctor.id}/appointment`)}`,
      );
      return;
    }

    if (currentUser.role !== "patient") {
      setModal({
        open: true,
        title: "Patient appointment only",
        message: "Only a patient account can submit an appointment request.",
        success: false,
      });
      return;
    }

    if (currentUser.status === "blocked") {
      setModal({
        open: true,
        title: "Appointment restricted",
        message:
          "You are restricted by the administrator and cannot take an appointment.",
        success: false,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitAppointment(doctor.id, values);
      setModal({
        open: true,
        title: "Appointment submitted",
        message: response.message,
        success: true,
      });
    } catch (error: unknown) {
      setModal({
        open: true,
        title: "Appointment could not be submitted",
        message: error instanceof Error ? error.message : "Please try again.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF9F9] py-10 dark:bg-[#211B27]">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Link
          href={`/find-doctors/${doctor.id}`}
          className="inline-flex items-center gap-2 text-sm font-black text-[#745D83] dark:text-[#F5CBCB]"
        >
          <LuArrowLeft className="size-4" /> Back to doctor details
        </Link>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <header className="bg-gradient-to-r from-[#FBEFEF] to-[#FFE2E2] p-6 dark:from-[#352B3D] dark:to-[#41354A] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-3xl bg-white text-3xl font-black text-[#745D83] shadow-sm dark:bg-[#211B27] dark:text-[#F5CBCB]">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  doctor.name.charAt(0)
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#745D83] dark:text-[#F5CBCB]">
                  Free appointment request
                </p>
                <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  {doctor.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-[#CDBFD0]">
                  <LuStethoscope className="size-4" /> {doctor.specialization}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-[#A997AE]">
                  <LuHospital className="size-4" /> {doctor.hospital}
                </p>
              </div>
            </div>
          </header>

          <form
            onSubmit={submit}
            className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
          >
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Patient Name
              <input
                required
                value={values.patientName}
                onChange={(event) => update("patientName", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Email
              <input
                value={currentUser?.email || ""}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Phone
              <input
                required
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Address
              <input
                required
                value={values.address}
                onChange={(event) => update("address", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8] sm:col-span-2">
              Health Problem / Symptoms Title
              <input
                required
                value={values.problemTitle}
                onChange={(event) => update("problemTitle", event.target.value)}
                placeholder="Example: Fever and breathing difficulty"
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8] sm:col-span-2">
              Describe all symptoms
              <textarea
                required
                rows={6}
                maxLength={5000}
                value={values.symptomsDescription}
                onChange={(event) =>
                  update("symptomsDescription", event.target.value)
                }
                placeholder="Describe when the symptoms started, severity, medicines taken, allergies and other important details..."
                className="w-full rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
              />
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Appointment Date
              <div className="relative">
                <LuCalendarCheck className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#745D83]" />
                <input
                  required
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={values.appointmentDate}
                  onChange={(event) =>
                    update("appointmentDate", event.target.value)
                  }
                  className={`${inputClass} pl-12`}
                />
              </div>
            </label>
            <label className="space-y-2 text-sm font-black text-slate-700 dark:text-[#E7DDE8]">
              Schedule Time
              <div className="relative">
                <LuClock3 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#745D83]" />
                <input
                  required
                  type="time"
                  value={values.appointmentTime}
                  onChange={(event) =>
                    update("appointmentTime", event.target.value)
                  }
                  className={`${inputClass} pl-12`}
                />
              </div>
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-[#745D83] text-sm font-black text-white disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]"
              >
                {isSubmitting
                  ? "Submitting Appointment..."
                  : "Submit Appointment Form"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MessageModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => {
          setModal((current) => ({ ...current, open: false }));
          if (modal.success) router.push("/dashboard/patient/appointments");
        }}
      />
    </main>
  );
};

export default AppointmentForm;
