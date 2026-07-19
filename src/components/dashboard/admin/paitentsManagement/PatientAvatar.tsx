"use client";

import { AdminManagedPatient } from "./ index";



interface PatientAvatarProps {
  patient: Pick<AdminManagedPatient, "name" | "email" | "image">;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-10 text-sm",
  md: "size-12 text-base",
  lg: "size-20 text-2xl",
};

const getInitials = (name: string, email: string): string => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length > 0) {
    return words.map((word) => word[0]?.toUpperCase() || "").join("");
  }

  return email[0]?.toUpperCase() || "P";
};

const PatientAvatar = ({
  patient,
  size = "md",
}: PatientAvatarProps) => {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FBEFEF] font-black text-[#745D83] ring-1 ring-[#F5CBCB] dark:bg-[#352B3D] dark:text-[#F5CBCB] dark:ring-[#55445F] ${sizeClasses[size]}`}
      aria-hidden="true"
    >
      {getInitials(patient.name, patient.email)}

      {patient.image && (
        <img
          src={patient.image}
          alt=""
          className="absolute inset-0 size-full object-cover"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
};

export default PatientAvatar;