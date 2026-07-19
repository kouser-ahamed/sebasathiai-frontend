export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

export type UserStatus = "active" | "blocked";

export interface PatientAppointment {
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

export interface AppointmentDoctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospital: string;
  address: string;
  bio: string;
  role: "doctor";
  status: "active" | "blocked";
  ratingAverage: number;
  ratingCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PatientAppointmentsResponse {
  success: boolean;
  appointments: PatientAppointment[];
  pagination: Pagination;
  message?: string;
}

export interface PatientAppointmentDetailsResponse {
  success: boolean;
  appointment: PatientAppointment;
  doctor: AppointmentDoctor | null;
  message?: string;
}

export interface AppointmentMutationResponse {
  success: boolean;
  message: string;
  appointment: PatientAppointment | null;
}

export interface AppointmentDeleteResponse {
  success: boolean;
  message: string;
  deletedAppointmentId: string;
}

export interface PatientAppointmentFormValues {
  patientName: string;
  phone: string;
  address: string;
  problemTitle: string;
  symptomsDescription: string;
  appointmentDate: string;
  appointmentTime: string;
}