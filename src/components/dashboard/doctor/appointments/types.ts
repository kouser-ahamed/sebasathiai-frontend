export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

export type UserStatus =
  | "active"
  | "blocked";

export interface DoctorAppointment {
  id: string;
  doctorId: string;
  doctorUserId: string;
  doctorName: string;
  doctorImage: string | null;
  specialization: string;
  hospital: string;
  patientUserId: string;
  patientName: string;
  patientEmail: string;
  patientImage: string | null;
  phone: string;
  address: string;
  problemTitle: string;
  symptomsDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  rejectionReason: string | null;
  approvedAt: string | null;
  completedAt: string | null;
  rejectedAt: string | null;
  rescheduledAt: string | null;
  rescheduledBy: string | null;
  rescheduleReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorAppointmentsResponse {
  success: boolean;
  appointments: DoctorAppointment[];
  pagination: Pagination;
  message?: string;
}

export interface DoctorAppointmentDetailsResponse {
  success: boolean;
  appointment: DoctorAppointment;
  message?: string;
}

export interface AppointmentMutationResponse {
  success: boolean;
  message: string;
  appointment: DoctorAppointment | null;
}