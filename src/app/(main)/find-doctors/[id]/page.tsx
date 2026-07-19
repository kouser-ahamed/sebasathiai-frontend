import { notFound } from "next/navigation";




import { getUserSession } from "@/lib/core/session";
import { getInitialDoctorReviews, getPublicDoctorDetails } from "@/components/AllDoctors/server-api";
import { CurrentUser } from "@/components/AllDoctors/types";
import DoctorDetails from "@/components/AllDoctors/DoctorDetails";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DoctorDetailsPageProps {
  params: Promise<{ doctorId: string }>;
}

const DoctorDetailsPage = async ({ params }: DoctorDetailsPageProps) => {
  const { doctorId } = await params;

  const [doctorResult, reviewsResult, session] = await Promise.all([
    getPublicDoctorDetails(doctorId).catch(() => null),
    getInitialDoctorReviews(doctorId).catch(() => null),
    getUserSession(),
  ]);

  if (!doctorResult?.doctor) notFound();

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