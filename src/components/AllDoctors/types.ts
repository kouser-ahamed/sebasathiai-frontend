export type UserRole = "admin" | "doctor" | "patient";
export type UserStatus = "active" | "blocked";
export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

export interface CurrentUser {
  id?: string;
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface Doctor {
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

export interface DoctorFiltersData {
  specializations: string[];
  qualifications: string[];
  hospitals: string[];
  experienceYears: number[];
}

export interface DoctorQuery {
  search: string;
  specialization: string;
  qualification: string;
  hospital: string;
  experienceYears: string;
  page: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorsResponse {
  success: boolean;
  doctors: Doctor[];
  pagination: Pagination;
  message?: string;
}

export interface DoctorFiltersResponse {
  success: boolean;
  filters: DoctorFiltersData;
  message?: string;
}

export interface DoctorDetailsResponse {
  success: boolean;
  doctor: Doctor;
  message?: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  rating: number;
  review: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: DoctorReview[];
  pagination: Pagination;
  message?: string;
}

export interface ReviewMutationResponse {
  success: boolean;
  message: string;
  review: DoctorReview | null;
}

export interface Appointment {
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
  phone: string;
  address: string;
  problemTitle: string;
  symptomsDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AppointmentEligibilityResponse {
  success: boolean;
  canBook: boolean;
  code?: string;
  message: string;
  appointment?: Appointment;
}

export interface AppointmentFormValues {
  patientName: string;
  phone: string;
  address: string;
  problemTitle: string;
  symptomsDescription: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentMutationResponse {
  success: boolean;
  message: string;
  appointment: Appointment | null;
}

export interface AppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
  pagination?: Pagination;
  message?: string;
}