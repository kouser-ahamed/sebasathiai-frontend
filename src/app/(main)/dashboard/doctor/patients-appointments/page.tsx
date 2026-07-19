import DoctorAppointments from "@/components/dashboard/doctor/appointments/DoctorAppointments";
import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PatientsAppointmentsPage =
  async () => {
    const user =
      await requireRole("doctor");

    return (
      <DoctorAppointments
        doctorName={user.name}
        userStatus={user.status}
      />
    );
  };

export default PatientsAppointmentsPage;