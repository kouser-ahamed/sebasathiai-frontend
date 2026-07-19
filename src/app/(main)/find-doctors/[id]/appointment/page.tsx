import { notFound } from "next/navigation";


import { getUserSession } from "@/lib/core/session";
import { getPublicDoctorDetails } from "@/components/AllDoctors/server-api";
import { CurrentUser } from "@/components/AllDoctors/types";
import AppointmentForm from "@/components/AllDoctors/AppointmentForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AppointmentPageProps {
  params: Promise<{ doctorId: string }>;
}

const AppointmentPage = async ({ params }: AppointmentPageProps) => {
  const { doctorId } = await params;
  const [doctorResult, session] = await Promise.all([
    getPublicDoctorDetails(doctorId).catch(() => null),
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

  return <AppointmentForm doctor={doctorResult.doctor} currentUser={currentUser} />;
};

export default AppointmentPage;