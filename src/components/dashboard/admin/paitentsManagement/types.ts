export type AdminPatientStatus = "active" | "blocked";

export interface AdminManagedPatient {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "patient";
  status: AdminPatientStatus;
  emailVerified: boolean;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  bloodGroup: string | null;
  occupation: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminPatientsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminPatientsListResponse {
  success: boolean;
  patients: AdminManagedPatient[];
  pagination: AdminPatientsPagination;
}

export interface AdminPatientDetailsResponse {
  success: boolean;
  patient: AdminManagedPatient;
}

export interface AdminPatientStatusResponse {
  success: boolean;
  message: string;
  patient: AdminManagedPatient;
}

export interface AdminPatientDeleteResponse {
  success: boolean;
  message: string;
  deletedPatientId: string;
}

export type PatientStatusFilter = "all" | AdminPatientStatus;

export type PatientManagementToast = {
  id: number;
  type: "success" | "error";
  message: string;
};