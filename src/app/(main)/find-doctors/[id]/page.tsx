// import { notFound } from "next/navigation";




// import { getUserSession } from "@/lib/core/session";
// import { getInitialDoctorReviews, getPublicDoctorDetails } from "@/components/AllDoctors/server-api";
// import { CurrentUser } from "@/components/AllDoctors/types";
// import DoctorDetails from "@/components/AllDoctors/DoctorDetails";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// interface DoctorDetailsPageProps {
//   params: Promise<{ id: string }>;
// }

// const DoctorDetailsPage = async ({ params }: DoctorDetailsPageProps) => {
//   const { id } = await params;

//   const [doctorResult, reviewsResult, session] = await Promise.all([
//     getPublicDoctorDetails(id).catch(() => null),
//     getInitialDoctorReviews(id).catch(() => null),
//     getUserSession(),
//   ]);

//   if (!doctorResult?.doctor) notFound();

//   const currentUser: CurrentUser | null = session
//     ? {
//         id: session.id,
//         _id: session._id,
//         name: session.name,
//         email: session.email,
//         image: session.image,
//         role: session.role,
//         status: session.status,
//       }
//     : null;

//   return (
//     <DoctorDetails
//       doctor={doctorResult.doctor}
//       reviews={reviewsResult?.reviews || []}
//       currentUser={currentUser}
//     />
//   );
// };

// export default DoctorDetailsPage;











import Link from "next/link";
import {
  LuArrowLeft,
  LuSearchX,
  LuStethoscope,
} from "react-icons/lu";

import DoctorDetails from "@/components/AllDoctors/DoctorDetails";
import {
  getInitialDoctorReviews,
  getPublicDoctorDetails,
} from "@/components/AllDoctors/server-api";
import type { CurrentUser } from "@/components/AllDoctors/types";
import { getUserSession } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DoctorDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DoctorNotFoundMessage = () => {
  return (
    <main className="min-h-[calc(100dvh-4.5rem)] bg-[#FFF9F9] px-4 py-10 dark:bg-[#211B27] sm:px-6 lg:px-4">
      <div className="mx-auto flex min-h-[65vh] w-full max-w-7xl items-center justify-center">
        <section className="w-full max-w-2xl rounded-[2rem] border border-[#F5CBCB] bg-white p-6 text-center shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-10">
          <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            <LuSearchX className="size-10" />
          </span>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#745D83] dark:text-[#F5CBCB]">
            Doctor Not Found
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Doctor profile is unavailable
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-7 text-slate-500 dark:text-[#A997AE]">
            No doctor was found using this ID. The ID may be incorrect, or the
            doctor profile may have been removed, blocked, or is currently
            unavailable.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/find-doctors"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#745D83] px-6 text-sm font-black text-white transition hover:bg-[#614E70] dark:bg-[#C5B3D3] dark:text-[#211B27] dark:hover:bg-[#F5CBCB]"
            >
              <LuStethoscope className="size-5" />
              Browse All Doctors
            </Link>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#C5B3D3] bg-white px-6 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
            >
              <LuArrowLeft className="size-5" />
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

const DoctorDetailsPage = async ({
  params,
}: DoctorDetailsPageProps) => {
  const { id } = await params;

  const doctorId = id?.trim();

  if (!doctorId) {
    return <DoctorNotFoundMessage />;
  }

  const [doctorResult, reviewsResult, session] = await Promise.all([
    getPublicDoctorDetails(doctorId).catch(() => null),
    getInitialDoctorReviews(doctorId).catch(() => null),
    getUserSession(),
  ]);

  if (!doctorResult?.doctor) {
    return <DoctorNotFoundMessage />;
  }

  const currentUser: CurrentUser | null = session
    ? {
        id: session.id,
        _id: session._id,
        name: session.name,
        email: session.email,
        image: session.image,
        role: session.role,
        status: session.status,
      }
    : null;

  return (
    <DoctorDetails
      doctor={doctorResult.doctor}
      reviews={reviewsResult?.reviews || []}
      currentUser={currentUser}
    />
  );
};

export default DoctorDetailsPage;