// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LuCalendarPlus, LuLoaderCircle } from "react-icons/lu";

// import MessageModal from "./MessageModal";
// import { checkAppointmentEligibility } from "./public-api";

// import type { CurrentUser } from "./types";

// interface AppointmentNowButtonProps {
//   doctorId: string;
//   currentUser: CurrentUser | null;
// }

// const AppointmentNowButton = ({
//   doctorId,
//   currentUser,
// }: AppointmentNowButtonProps) => {
//   const router = useRouter();
//   const [isChecking, setIsChecking] = useState(false);
//   const [modal, setModal] = useState({
//     open: false,
//     title: "",
//     message: "",
//   });

//   const showMessage = (title: string, message: string) => {
//     setModal({ open: true, title, message });
//   };

//   const handleAppointment = async () => {
//     if (!currentUser?.id) {
//       router.push(
//         `/auth/login?callbackURL=${encodeURIComponent(`/find-doctors/${doctorId}/appointment`)}`,
//       );
//       return;
//     }

//     if (currentUser.role !== "patient") {
//       showMessage(
//         "Patient appointment only",
//         "Administrators and doctors cannot take an appointment. Only a patient account can submit an appointment request.",
//       );
//       return;
//     }

//     if (currentUser.status === "blocked") {
//       showMessage(
//         "Appointment restricted",
//         "You are restricted by the administrator and cannot take an appointment.",
//       );
//       return;
//     }

//     setIsChecking(true);

//     try {
//       const response = await checkAppointmentEligibility(doctorId);

//       if (!response.canBook) {
//         showMessage("Appointment unavailable", response.message);
//         return;
//       }

//       router.push(`/find-doctors/${doctorId}/appointment`);
//     } catch (error: unknown) {
//       showMessage(
//         "Appointment unavailable",
//         error instanceof Error ? error.message : "Appointment eligibility could not be checked.",
//       );
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={() => void handleAppointment()}
//         disabled={isChecking}
//         className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#745D83] px-6 text-sm font-black text-white shadow-sm transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C5B3D3] dark:text-[#211B27]"
//       >
//         {isChecking ? <LuLoaderCircle className="size-5 animate-spin" /> : <LuCalendarPlus className="size-5" />}
//         Appointment Now
//       </button>

//       <MessageModal
//         isOpen={modal.open}
//         title={modal.title}
//         message={modal.message}
//         onClose={() => setModal((current) => ({ ...current, open: false }))}
//       />
//     </>
//   );
// };

// export default AppointmentNowButton;








"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LuCalendarPlus,
  LuLoaderCircle,
} from "react-icons/lu";

import MessageModal from "./MessageModal";
import { checkAppointmentEligibility } from "./public-api";

import type { CurrentUser } from "./types";

interface AppointmentNowButtonProps {
  doctorId: string;
  currentUser: CurrentUser | null;
}

const AppointmentNowButton = ({
  doctorId,
  currentUser,
}: AppointmentNowButtonProps) => {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showMessage = (
    title: string,
    message: string,
  ) => {
    setModal({
      open: true,
      title,
      message,
    });
  };

  const handleAppointment = async () => {
    if (!currentUser?.id) {
      router.push(
        `/auth/login?callbackURL=${encodeURIComponent(
          `/find-doctors/${doctorId}/appointment`,
        )}`,
      );

      return;
    }

    if (currentUser.role !== "patient") {
      showMessage(
        "Patient appointment only",
        "Administrators and doctors cannot take an appointment. Only a patient account can submit an appointment request.",
      );

      return;
    }

    if (currentUser.status === "blocked") {
      showMessage(
        "Appointment restricted",
        "You are restricted by the administrator and cannot take an appointment.",
      );

      return;
    }

    setIsChecking(true);

    try {
      const response =
        await checkAppointmentEligibility(doctorId);

      if (!response.canBook) {
        showMessage(
          "Appointment unavailable",
          response.message,
        );

        return;
      }

      router.push(
        `/find-doctors/${doctorId}/appointment`,
      );
    } catch (error: unknown) {
      showMessage(
        "Appointment unavailable",
        error instanceof Error
          ? error.message
          : "Appointment eligibility could not be checked.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleAppointment()}
        disabled={isChecking}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#745D83] px-6 text-sm font-black text-white shadow-sm transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C5B3D3] dark:text-[#211B27]"
      >
        {isChecking ? (
          <LuLoaderCircle className="size-5 animate-spin" />
        ) : (
          <LuCalendarPlus className="size-5" />
        )}

        Appointment Now
      </button>

      <MessageModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() =>
          setModal((current) => ({
            ...current,
            open: false,
          }))
        }
      />
    </>
  );
};

export default AppointmentNowButton;