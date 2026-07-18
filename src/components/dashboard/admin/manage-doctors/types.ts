export type DoctorStatus = "active" | "blocked";

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
  status: DoctorStatus;
  emailVerified?: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DoctorFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears: string;
  hospital: string;
  address: string;
  bio: string;
  image: string;
}

export interface DoctorsResponse {
  success: boolean;
  doctors: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface DoctorMutationResponse {
  success: boolean;
  message: string;
  doctor: Doctor;
}

export interface DeleteDoctorResponse {
  success: boolean;
  message: string;
  deletedDoctorId: string;
}

export interface DoctorDetailsResponse {
  success: boolean;
  doctor: Doctor;
  message?: string;
}
