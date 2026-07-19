"use client";

import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuBot,
  LuCheck,
  LuClipboardPlus,
  LuHistory,
  LuLoaderCircle,
  LuMenu,
  LuMessageCircleHeart,
  LuPlus,
  LuSend,
  LuShieldCheck,
  LuSparkles,
  LuStethoscope,
  LuTriangleAlert,
} from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

import AccessStateCard from "./AccessStateCard";
import AIChatMessage from "./AIChatMessage";
import AIConversationSidebar from "./AIConversationSidebar";
import AIHealthSummaryCard from "./AIHealthSummaryCard";
import {
  checkAIHealthAccess,
  createAIHealthConversation,
  deleteAIHealthConversation,
  fetchAIHealthConversation,
  fetchAIHealthConversations,
  generateAIHealthSummary,
  sendPersistentAIHealthMessage,
} from "./ai-health-api";
import type {
  AIHealthAccessState,
  AIHealthChatMessage,
  AIHealthConversation,
  AIHealthHistory,
} from "./types";

const ACTIVE_CHAT_STORAGE_KEY = "sebasathi-ai-active-chat";

const welcomeMessage: AIHealthChatMessage = {
  id: "welcome",
  role: "assistant",
  isWelcome: true,
  content:
    "Hello! Tell me your symptoms, when they started, severity, and age range. I will keep the guidance concise and suggest a suitable doctor category.",
};

const quickPrompts = [
  "I have fever and body pain for two days.",
  "I often have headaches and dizziness.",
  "I have stomach pain after eating.",
  "I have a skin rash and itching.",
];

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

const sortConversations = (
  conversations: AIHealthConversation[],
): AIHealthConversation[] => {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
    const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
    return bTime - aTime;
  });
};

const AIHealthAssistant = () => {
  const [accessState, setAccessState] =
    useState<AIHealthAccessState>("loading");
  const [accessMessage, setAccessMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [conversations, setConversations] = useState<AIHealthConversation[]>(
    [],
  );
  const [activeConversation, setActiveConversation] =
    useState<AIHealthConversation | null>(null);
  const [input, setInput] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedHistory, setSavedHistory] = useState<AIHealthHistory | null>(
    null,
  );
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo<AIHealthChatMessage[]>(
    () => [welcomeMessage, ...(activeConversation?.messages || [])],
    [activeConversation],
  );

  const hasUserMessage = Boolean(
    activeConversation?.messages.some((message) => message.role === "user"),
  );

  const showSuccess = (message: string) => {
    toast.success(message, {
      autoClose: 1000,
      hideProgressBar: true,
      icon: <LuCheck className="size-5 text-white" />,
      style: {
        background: "#745D83",
        color: "#FFFFFF",
        fontWeight: 700,
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      autoClose: 1800,
      hideProgressBar: true,
      icon: <LuTriangleAlert className="size-5 text-white" />,
      style: {
        background: "#B91C1C",
        color: "#FFFFFF",
        fontWeight: 700,
      },
    });
  };

  const putConversationFirst = useCallback(
    (conversation: AIHealthConversation) => {
      setConversations((current) =>
        sortConversations([
          conversation,
          ...current.filter((item) => item.id !== conversation.id),
        ]),
      );
    },
    [],
  );

  const selectConversation = useCallback(async (conversationId: string) => {
    setIsLoadingChats(true);

    try {
      const response = await fetchAIHealthConversation(conversationId);
      setActiveConversation(response.conversation);
      setSavedHistory(
        response.conversation.summaryReport &&
          response.conversation.summaryHistoryId
          ? {
              id: response.conversation.summaryHistoryId,
              conversationId: response.conversation.id,
              conversationTitle: response.conversation.title,
              userId: response.conversation.userId,
              userRole: response.conversation.userRole,
              userName: response.conversation.userName,
              userEmail: response.conversation.userEmail,
              userImage: response.conversation.userImage,
              patientUserId: response.conversation.userId,
              patientName: response.conversation.userName,
              patientEmail: response.conversation.userEmail,
              provider: "groq",
              model: "",
              report: response.conversation.summaryReport,
              messages: response.conversation.messages.map(
                ({ role, content }) => ({ role, content }),
              ),
              createdAt: response.conversation.createdAt,
              updatedAt: response.conversation.updatedAt,
            }
          : null,
      );
      localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, conversationId);
      setHistoryOpen(false);
    } catch (error: unknown) {
      showError(
        getErrorMessage(error, "The saved conversation could not be opened."),
      );
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  const createNewChat = useCallback(
    async (notify = true) => {
      if (isCreatingChat || isSending || isSummarizing) return;

      setIsCreatingChat(true);

      try {
        const response = await createAIHealthConversation();
        setActiveConversation(response.conversation);
        putConversationFirst(response.conversation);
        setSavedHistory(null);
        setInput("");
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, response.conversation.id);
        setHistoryOpen(false);

        if (notify) {
          showSuccess("A new health chat has started.");
        }
      } catch (error: unknown) {
        showError(getErrorMessage(error, "A new chat could not be created."));
      } finally {
        setIsCreatingChat(false);
      }
    },
    [isCreatingChat, isSending, isSummarizing, putConversationFirst],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const access = await checkAIHealthAccess();

        if (!access) {
          setAccessState("guest");
          setAccessMessage(
            "This page is public, but chat and saved history require a signed-in active account.",
          );
          return;
        }

        setUserName(access.user.name);
        setAccessMessage(access.message);

        if (!access.allowed) {
          setAccessState(access.status === "blocked" ? "blocked" : "error");
          return;
        }

        setAccessState("allowed");
        setIsLoadingChats(true);
        const listResponse = await fetchAIHealthConversations();
        const sorted = sortConversations(listResponse.conversations);
        setConversations(sorted);

        const savedId = localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);
        const preferred =
          sorted.find((conversation) => conversation.id === savedId) ||
          sorted[0];

        if (preferred) {
          const detail = await fetchAIHealthConversation(preferred.id);
          setActiveConversation(detail.conversation);
          localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, detail.conversation.id);
        } else {
          const created = await createAIHealthConversation();
          setActiveConversation(created.conversation);
          setConversations([created.conversation]);
          localStorage.setItem(
            ACTIVE_CHAT_STORAGE_KEY,
            created.conversation.id,
          );
        }
      } catch (error: unknown) {
        setAccessState("error");
        setAccessMessage(
          getErrorMessage(error, "AI Health Assistant could not be loaded."),
        );
      } finally {
        setIsLoadingChats(false);
      }
    };

    void initialize();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (preset?: string) => {
    if (
      accessState !== "allowed" ||
      isSending ||
      isSummarizing ||
      !activeConversation
    ) {
      return;
    }

    const content = (preset ?? input).trim();

    if (!content) return;

    if (content.length > 4000) {
      showError("A message cannot contain more than 4000 characters.");
      return;
    }

    const optimisticUserMessage: AIHealthChatMessage = {
      id: `pending-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setActiveConversation((current) =>
      current
        ? {
            ...current,
            messages: [...current.messages, optimisticUserMessage],
            messageCount: current.messageCount + 1,
            summaryHistoryId: null,
            summaryReport: null,
          }
        : current,
    );
    setInput("");
    setSavedHistory(null);
    setIsSending(true);

    try {
      const response = await sendPersistentAIHealthMessage(
        activeConversation.id,
        content,
      );

      if (response.conversation) {
        setActiveConversation(response.conversation);
        putConversationFirst(response.conversation);
      }
    } catch (error: unknown) {
      setActiveConversation((current) =>
        current
          ? {
              ...current,
              messages: current.messages.filter(
                (message) => message.id !== optimisticUserMessage.id,
              ),
              messageCount: Math.max(0, current.messageCount - 1),
            }
          : current,
      );
      showError(getErrorMessage(error, "The AI assistant could not respond."));
    } finally {
      setIsSending(false);
    }
  };

  const createSummary = async () => {
    if (
      accessState !== "allowed" ||
      !activeConversation ||
      !hasUserMessage ||
      isSummarizing ||
      isSending
    ) {
      return;
    }

    setIsSummarizing(true);

    try {
      const response = await generateAIHealthSummary(activeConversation.id);
      setSavedHistory(response.history);

      if (response.conversation) {
        setActiveConversation(response.conversation);
        putConversationFirst(response.conversation);
      } else {
        setActiveConversation((current) =>
          current
            ? {
                ...current,
                summaryHistoryId: response.history.id,
                summaryReport: response.history.report,
              }
            : current,
        );
      }

      showSuccess(response.message);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "The summary could not be generated."));
    } finally {
      setIsSummarizing(false);
    }
  };

  const deleteConversation = async (conversation: AIHealthConversation) => {
    if (isSending || isSummarizing || isCreatingChat) return;

    const confirmed = window.confirm(
      `Delete “${conversation.title}”? This removes the saved chat permanently.`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteAIHealthConversation(conversation.id);
      const remaining = conversations.filter(
        (item) => item.id !== conversation.id,
      );
      setConversations(remaining);

      if (activeConversation?.id === conversation.id) {
        if (remaining[0]) {
          await selectConversation(remaining[0].id);
        } else {
          await createNewChat(false);
        }
      }

      showSuccess(response.message);
    } catch (error: unknown) {
      showError(getErrorMessage(error, "The chat could not be deleted."));
    }
  };

  const ActionButtons = ({ compact = false }: { compact?: boolean }) => (
    <div className={`grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
      <button
        type="button"
        onClick={() => void createNewChat()}
        disabled={isCreatingChat || isSending || isSummarizing}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] px-3 text-xs font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D] sm:text-sm"
      >
        {isCreatingChat ? (
          <LuLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LuPlus className="size-4" />
        )}
        New Chat
      </button>

      <button
        type="button"
        onClick={() => void createSummary()}
        disabled={!hasUserMessage || isSending || isSummarizing}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-3 text-xs font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#C5B3D3] dark:text-[#211B27] sm:text-sm"
      >
        {isSummarizing ? (
          <LuLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LuClipboardPlus className="size-4" />
        )}
        Summary
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FFF9F9] px-3 py-4 dark:bg-[#211B27] sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FBEFEF] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                  <LuSparkles className="size-4" />
                  Powered by Groq
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <LuShieldCheck className="size-4" />
                  General guidance only
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                SebaSathi AI Health Assistant
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                Describe symptoms in Bangla, Banglish or English. Chats are
                automatically stored in All History for your active account.
              </p>
            </div>

            {accessState === "allowed" && (
              <div className="min-w-[260px]">
                <ActionButtons />
              </div>
            )}
          </div>

          <div className="border-t border-[#F5CBCB] bg-[#FBEFEF]/65 px-5 py-2.5 text-xs font-semibold leading-5 text-[#614E70] dark:border-[#41354A] dark:bg-[#352B3D]/70 dark:text-[#CDBFD0]">
            <LuTriangleAlert className="mr-2 inline size-4 align-text-bottom text-amber-600" />
            Severe chest pain, breathing difficulty, unconsciousness, seizure,
            heavy bleeding, stroke signs or self-harm risk need immediate care.
          </div>
        </header>

        {accessState === "loading" ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233]">
            <LuLoaderCircle className="size-10 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
          </div>
        ) : accessState !== "allowed" ? (
          <AccessStateCard state={accessState} message={accessMessage} />
        ) : (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_380px]">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setHistoryOpen((current) => !current)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] bg-white text-sm font-black text-[#614E70] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB]"
              >
                <LuMenu className="size-4" />
                {historyOpen ? "Hide All History" : "Open All History"}
              </button>
            </div>

            <AIConversationSidebar
              conversations={conversations}
              activeConversationId={activeConversation?.id || null}
              isOpen={historyOpen}
              isBusy={isSending || isSummarizing || isCreatingChat}
              onClose={() => setHistoryOpen(false)}
              onNewChat={() => void createNewChat()}
              onSelect={(conversationId) =>
                void selectConversation(conversationId)
              }
              onDelete={(conversation) => void deleteConversation(conversation)}
            />

            <section className="flex min-h-[640px] min-w-0 flex-col overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:min-h-[720px]">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#F5CBCB] px-4 py-3.5 dark:border-[#41354A] sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]">
                    <LuMessageCircleHeart className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-black text-slate-950 dark:text-white">
                      {activeConversation?.title ||
                        `Health chat for ${userName}`}
                    </h2>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                      Auto-saved · Active account
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#FBEFEF] px-3 py-1.5 text-xs font-black text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                  <LuBot className="size-4" />
                  AI online
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden bg-slate-50/45 p-3 sm:p-4 dark:bg-[#211B27]/35">
                {isLoadingChats ? (
                  <div className="flex min-h-64 items-center justify-center">
                    <LuLoaderCircle className="size-8 animate-spin text-[#745D83]" />
                  </div>
                ) : (
                  messages.map((message) => (
                    <AIChatMessage key={message.id} message={message} />
                  ))
                )}

                {isSending && (
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]">
                      <LuBot className="size-4" />
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#F5CBCB] bg-white px-3 py-2.5 text-sm font-bold text-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-[#F5CBCB]">
                      <LuLoaderCircle className="size-4 animate-spin" />
                      Reviewing symptoms...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {!hasUserMessage && (
                <div className="border-t border-[#F5CBCB] px-4 py-3 dark:border-[#41354A]">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Quick examples
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="shrink-0 rounded-full border border-[#C5B3D3] bg-[#FBEFEF] px-3 py-1.5 text-xs font-bold text-[#614E70] transition hover:bg-[#FFE2E2] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-[#F5CBCB] p-3 dark:border-[#41354A] sm:p-4">
                <div className="mb-3">
                  <ActionButtons compact />
                </div>

                <div className="flex min-w-0 items-end gap-2 rounded-2xl border border-[#E4D5E7] bg-white p-2 transition focus-within:border-[#745D83] focus-within:ring-4 focus-within:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D]">
                  <textarea
                    value={input}
                    maxLength={4000}
                    rows={2}
                    disabled={isSending || isSummarizing || !activeConversation}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Describe symptoms, duration, severity and age range..."
                    className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || isSending || isSummarizing}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#745D83] text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#C5B3D3] dark:text-[#211B27]"
                    aria-label="Send health message"
                  >
                    {isSending ? (
                      <LuLoaderCircle className="size-5 animate-spin" />
                    ) : (
                      <LuSend className="size-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Enter to send · Shift + Enter for new line</span>
                  <span>{input.length}/4000</span>
                </div>
              </div>
            </section>

            <aside className="min-w-0 lg:col-start-2 2xl:col-start-3 2xl:row-start-1">
              {savedHistory ||
              (activeConversation?.summaryReport &&
                activeConversation.summaryHistoryId) ? (
                <AIHealthSummaryCard
                  report={
                    savedHistory?.report || activeConversation!.summaryReport!
                  }
                  historyId={
                    savedHistory?.id || activeConversation!.summaryHistoryId!
                  }
                />
              ) : (
                <div className="rounded-3xl border border-[#F5CBCB] bg-white p-5 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                    <LuClipboardPlus className="size-5" />
                  </span>
                  <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">
                    Summary report
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
                    Generate a structured report after discussing symptoms. The
                    report and full chat remain linked to this saved
                    conversation.
                  </p>
                  <Link
                    href="/doctors"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#745D83] dark:text-[#F5CBCB]"
                  >
                    <LuStethoscope className="size-4" />
                    Browse doctors
                  </Link>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        limit={3}
      />
    </main>
  );
};

export default AIHealthAssistant;
