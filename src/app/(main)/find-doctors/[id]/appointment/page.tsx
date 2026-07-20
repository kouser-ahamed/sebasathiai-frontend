import { notFound, redirect } from "next/navigation";


import { getUserSession } from "@/lib/core/session";
import { getPublicDoctorDetails } from "@/components/AllDoctors/server-api";
import { CurrentUser } from "@/components/AllDoctors/types";
import AppointmentForm from "@/components/AllDoctors/AppointmentForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

const AppointmentPage = async ({ params }: AppointmentPageProps) => {
  const { id } = await params;
  const [doctorResult, session] = await Promise.all([
    getPublicDoctorDetails(id).catch(() => null),
    getUserSession(),
  ]);

  if (!doctorResult?.doctor) notFound();

  if (!session?.id) {
    const callbackURL = `/find-doctors/${id}/appointment`;

    redirect(`/auth/login?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

  const currentUser: CurrentUser = {
    id: session.id,
    _id: session._id,
    name: session.name,
    email: session.email,
    image: session.image,
    role: session.role,
    status: session.status,
  };

  return <AppointmentForm doctor={doctorResult.doctor} currentUser={currentUser} />;
};

export default AppointmentPage;