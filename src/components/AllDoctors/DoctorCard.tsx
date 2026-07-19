import Link from "next/link";
import {
  LuBriefcaseMedical,
  LuGraduationCap,
  LuHospital,
  LuStethoscope,
} from "react-icons/lu";

import RatingStars from "./RatingStars";

import type { Doctor } from "./types";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const initial = doctor.name.trim().charAt(0).toUpperCase() || "D";

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#41354A] dark:bg-[#2A2233]">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#FBEFEF] via-[#FFE2E2] to-[#C5B3D3]/55 dark:from-[#352B3D] dark:via-[#2A2233] dark:to-[#41354A]">
        {doctor.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doctor.image}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl font-black text-[#745D83] dark:text-[#F5CBCB]">
            {initial}
          </div>
        )}

        <span className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-black text-emerald-700 shadow-sm backdrop-blur dark:border-[#5D4C69] dark:bg-[#211B27]/90 dark:text-emerald-400">
          Free Service
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-1 text-xl font-black text-slate-900 dark:text-white">
            {doctor.name}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
            <LuStethoscope className="size-4 shrink-0" />
            <span className="line-clamp-1">
              {doctor.specialization || "General Physician"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars value={doctor.ratingAverage} sizeClassName="size-4" />
          <span className="text-xs font-bold text-slate-500 dark:text-[#A997AE]">
            {doctor.ratingAverage.toFixed(1)} ({doctor.ratingCount})
          </span>
        </div>

        <div className="space-y-2.5 text-sm text-slate-600 dark:text-[#CDBFD0]">
          <p className="flex items-start gap-2">
            <LuBriefcaseMedical className="mt-0.5 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
            <span>{doctor.experienceYears} years of experience</span>
          </p>

          <p className="flex items-start gap-2">
            <LuHospital className="mt-0.5 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
            <span className="line-clamp-2">
              {doctor.hospital || "Government hospital"}
            </span>
          </p>

          <p className="flex items-start gap-2">
            <LuGraduationCap className="mt-0.5 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
            <span className="line-clamp-2">
              {doctor.qualification || "Qualification not provided"}
            </span>
          </p>
        </div>

        <Link
          href={`/find-doctors/${doctor.id}`}
          className="flex h-11 items-center justify-center rounded-xl bg-[#745D83] text-sm font-black text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default DoctorCard;
