export type AIHealthRole = "user" | "assistant";

export type AIHealthUrgency =
  | "routine"
  | "soon"
  | "urgent"
  | "emergency";

export interface AIHealthAPIMessage {
  role: AIHealthRole;
  content: string;
}

export interface AIHealthAssistantData {
  reply: string;
  urgencyLevel: AIHealthUrgency;
  suggestedSpecialists: string[];
  recommendedActions: string[];
  warningSigns: string[];
  followUpQuestions: string[];
  disclaimer: string;
}

export interface AIHealthChatMessage extends AIHealthAPIMessage {
  id: string;
  assistant?: AIHealthAssistantData;
  isWelcome?: boolean;
}

export interface AIHealthAccessResponse {
  success: boolean;
  authenticated: boolean;
  allowed: boolean;
  role: "admin" | "doctor" | "patient";
  status: "active" | "blocked";
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  message: string;
}

export interface AIHealthChatResponse {
  success: boolean;
  provider: "groq";
  model: string;
  assistant: AIHealthAssistantData;
}

export interface AIHealthSummaryReport {
  reportTitle: string;
  conciseSummary: string;
  chiefConcerns: string[];
  symptoms: string[];
  durationAndPattern: string;
  severity: string;
  urgencyLevel: AIHealthUrgency;
  redFlags: string[];
  suggestedSpecialists: string[];
  selfCareGuidance: string[];
  questionsForDoctor: string[];
  emergencyAdvice: string;
  disclaimer: string;
}

export interface AIHealthHistory {
  id: string;
  userId: string;
  userRole: "admin" | "doctor" | "patient";
  userName: string;
  userEmail: string;
  userImage: string | null;
  patientUserId: string;
  patientName: string;
  patientEmail: string;
  provider: string;
  model: string;
  report: AIHealthSummaryReport;
  messages: AIHealthAPIMessage[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AIHealthSummaryResponse {
  success: boolean;
  message: string;
  history: AIHealthHistory;
}

export type AIHealthAccessState =
  | "loading"
  | "guest"
  | "blocked"
  | "allowed"
  | "error";