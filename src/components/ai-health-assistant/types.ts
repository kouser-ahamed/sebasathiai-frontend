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
  assistant?: AIHealthAssistantData | null;
  createdAt?: string | null;
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

export interface AIHealthConversation {
  id: string;
  title: string;
  userId: string;
  userRole: "admin" | "doctor" | "patient";
  userName: string;
  userEmail: string;
  userImage: string | null;
  messages: AIHealthChatMessage[];
  messageCount: number;
  summaryHistoryId: string | null;
  summaryReport: AIHealthSummaryReport | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastMessageAt: string | null;
}

export interface AIHealthConversationListResponse {
  success: boolean;
  conversations: AIHealthConversation[];
}

export interface AIHealthConversationResponse {
  success: boolean;
  message?: string;
  conversation: AIHealthConversation;
}

export interface AIHealthPersistentChatResponse {
  success: boolean;
  provider: "groq";
  model: string;
  userMessage: AIHealthChatMessage;
  assistantMessage: AIHealthChatMessage;
  conversation: AIHealthConversation | null;
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
  conversationId: string | null;
  conversationTitle: string | null;
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
  conversation: AIHealthConversation | null;
}

export interface AIHealthDeleteConversationResponse {
  success: boolean;
  message: string;
  deletedConversationId: string;
}

export type AIHealthAccessState =
  | "loading"
  | "guest"
  | "blocked"
  | "allowed"
  | "error";