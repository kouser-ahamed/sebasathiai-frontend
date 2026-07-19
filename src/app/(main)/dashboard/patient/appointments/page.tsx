import PatientAppointments from "@/components/dashboard/patient/appointments/PatientAppointments";
import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PatientAppointmentsPage = async () => {
  const user = await requireRole("patient");

  return (
    <PatientAppointments
      patientName={user.name}
      userStatus={user.status}
    />
  );
};

export default PatientAppointmentsPage;