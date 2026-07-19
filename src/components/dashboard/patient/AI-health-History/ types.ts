export type PatientAIHealthAccountStatus = "active" | "blocked";

export type PatientAIHealthMessageRole = "user" | "assistant";

export type PatientAIHealthUrgency =
  | "routine"
  | "soon"
  | "urgent"
  | "emergency";

export interface PatientAIHealthMessage {
  role: PatientAIHealthMessageRole;
  content: string;
}

export interface PatientAIHealthSummaryReport {
  reportTitle: string;
  conciseSummary: string;
  chiefConcerns: string[];
  symptoms: string[];
  durationAndPattern: string;
  severity: string;
  urgencyLevel: PatientAIHealthUrgency;
  redFlags: string[];
  suggestedSpecialists: string[];
  selfCareGuidance: string[];
  questionsForDoctor: string[];
  emergencyAdvice: string;
  disclaimer: string;
}

export interface PatientAIHealthHistory {
  id: string;
  conversationId: string | null;
  conversationTitle: string | null;
  userId: string;
  userRole: "patient";
  userName: string;
  userEmail: string;
  userImage: string | null;
  patientUserId: string;
  patientName: string;
  patientEmail: string;
  provider: string;
  model: string;
  report: PatientAIHealthSummaryReport;
  messages: PatientAIHealthMessage[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PatientAIHealthAccount {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "patient";
  status: PatientAIHealthAccountStatus;
}

export interface PatientAIHealthPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PatientAIHealthHistoryListResponse {
  success: boolean;
  account: PatientAIHealthAccount;
  canDelete: boolean;
  histories: PatientAIHealthHistory[];
  pagination: PatientAIHealthPagination;
}

export interface PatientAIHealthHistoryDetailsResponse {
  success: boolean;
  account: PatientAIHealthAccount;
  canDelete: boolean;
  history: PatientAIHealthHistory;
}

export interface PatientAIHealthHistoryDeleteResponse {
  success: boolean;
  message: string;
  deletedHistoryId: string;
}