import type { ComponentType } from "react";
import Link from "next/link";
import {
  LuArrowLeft,
  LuBriefcaseMedical,
  LuGraduationCap,
  LuHospital,
  LuMail,
  LuMapPin,
  LuPhone,
  LuStethoscope,
} from "react-icons/lu";

import AppointmentNowButton from "./AppointmentNowButton";
import RatingStars from "./RatingStars";
import ReviewSection from "./ReviewSection";

import type { CurrentUser, Doctor, DoctorReview } from "./types";

interface DoctorDetailsProps {
  doctor: Doctor;
  reviews: DoctorReview[];
  currentUser: CurrentUser | null;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/50 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/55">
    <div className="flex gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#745D83] shadow-sm dark:bg-[#2A2233] dark:text-[#F5CBCB]"><Icon className="size-5" /></span>
      <div><p className="text-xs font-black uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">{label}</p><p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800 dark:text-[#E7DDE8]">{value || "Not provided"}</p></div>
    </div>
  </div>
);

const DoctorDetails = ({ doctor, reviews, currentUser }: DoctorDetailsProps) => {
  const initial = doctor.name.trim().charAt(0).toUpperCase() || "D";

  return (
    <main className="min-h-screen bg-[#FFF9F9] py-10 dark:bg-[#211B27]">
      <div className="mx-auto w-full max-w-6xl space-y-7 px-4 sm:px-6 lg:px-8">
        <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-black text-[#745D83] hover:text-[#614E70] dark:text-[#F5CBCB]"><LuArrowLeft className="size-4" /> Back to all doctors</Link>

        <section className="overflow-hidden rounded-[2rem] border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <div className="grid lg:grid-cols-[340px_1fr]">
            <div className="min-h-80 bg-gradient-to-br from-[#FBEFEF] via-[#FFE2E2] to-[#C5B3D3] dark:from-[#352B3D] dark:via-[#2A2233] dark:to-[#41354A]">
              {doctor.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doctor.image} alt={doctor.name} referrerPolicy="no-referrer" className="h-full min-h-80 w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-80 items-center justify-center text-8xl font-black text-[#745D83] dark:text-[#F5CBCB]">{initial}</div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400">Free Government Service</span>
              <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">{doctor.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-base font-black text-[#745D83] dark:text-[#F5CBCB]"><LuStethoscope className="size-5" /> {doctor.specialization}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3"><RatingStars value={doctor.ratingAverage} /><span className="text-sm font-black text-slate-700 dark:text-white">{doctor.ratingAverage.toFixed(1)}</span><span className="text-sm text-slate-500 dark:text-[#A997AE]">from {doctor.ratingCount} rating{doctor.ratingCount === 1 ? "" : "s"}</span></div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-[#CDBFD0]">{doctor.bio || "No professional biography has been provided."}</p>
              <div className="mt-6"><AppointmentNowButton doctorId={doctor.id} currentUser={currentUser} /></div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem icon={LuGraduationCap} label="Qualification" value={doctor.qualification} />
          <DetailItem icon={LuBriefcaseMedical} label="Experience" value={`${doctor.experienceYears} years`} />
          <DetailItem icon={LuHospital} label="Hospital" value={doctor.hospital} />
          <DetailItem icon={LuPhone} label="Phone" value={doctor.phone} />
          <DetailItem icon={LuMail} label="Email" value={doctor.email} />
          <DetailItem icon={LuMapPin} label="Address" value={doctor.address} />
        </section>

        <ReviewSection doctorId={doctor.id} initialReviews={reviews} currentUser={currentUser} />
      </div>
    </main>
  );
};

export default DoctorDetails;