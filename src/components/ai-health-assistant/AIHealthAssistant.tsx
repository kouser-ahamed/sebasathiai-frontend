"use client";

import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LuBot,
  LuBrainCircuit,
  LuCheck,
  LuClipboardPlus,
  LuEraser,
  LuHeartPulse,
  LuLoaderCircle,
  LuMessageCircleHeart,
  LuSend,
  LuShieldCheck,
  LuSparkles,
  LuStethoscope,
  LuTriangleAlert,
} from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

import AccessStateCard from "./AccessStateCard";
import AIChatMessage from "./AIChatMessage";
import AIHealthSummaryCard from "./AIHealthSummaryCard";
import {
  checkAIHealthAccess,
  generateAIHealthSummary,
  sendAIHealthMessage,
} from "./ai-health-api";
import type {
  AIHealthAPIMessage,
  AIHealthAccessState,
  AIHealthChatMessage,
  AIHealthHistory,
} from "./types";

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const welcomeMessage: AIHealthChatMessage = {
  id: "welcome",
  role: "assistant",
  isWelcome: true,
  content:
    "Hello! I am SebaSathi AI Health Assistant. Tell me what symptoms you are experiencing, when they started, how severe they feel, and your age range. I can provide general guidance and suggest which type of doctor may be appropriate.",
};

const quickPrompts = [
  "I have fever and body pain for two days.",
  "I often have headaches and dizziness.",
  "I have stomach pain after eating.",
  "I have a skin rash and itching.",
];

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim()
    ? error.message
    : fallback;

const AIHealthAssistant = () => {
  const [accessState, setAccessState] =
    useState<AIHealthAccessState>("loading");
  const [accessMessage, setAccessMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<AIHealthChatMessage[]>([
    welcomeMessage,
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [savedHistory, setSavedHistory] =
    useState<AIHealthHistory | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadAccess = async () => {
      try {
        const access = await checkAIHealthAccess();

        if (!access) {
          setAccessState("guest");
          setAccessMessage(
            "This page is public, but chatting is available only to signed-in users whose account status is active.",
          );
          return;
        }

        setUserName(access.user.name);
        setAccessMessage(access.message);

        if (access.allowed) {
          setAccessState("allowed");
        } else if (access.status === "blocked") {
          setAccessState("blocked");
        } else {
          setAccessState("error");
        }
      } catch (error: unknown) {
        setAccessState("error");
        setAccessMessage(
          getErrorMessage(error, "AI Health access could not be verified."),
        );
      }
    };

    void loadAccess();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const apiMessages = useMemo<AIHealthAPIMessage[]>(
    () =>
      messages
        .filter((message) => !message.isWelcome)
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const hasUserMessage = apiMessages.some(
    (message) => message.role === "user",
  );

  const showSuccess = (message: string) => {
    toast.success(message, {
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
      icon: <LuTriangleAlert className="size-5 text-white" />,
      style: {
        background: "#B91C1C",
        color: "#FFFFFF",
        fontWeight: 700,
      },
    });
  };

  const sendMessage = async (preset?: string) => {
    if (accessState !== "allowed" || isSending) return;

    const content = (preset ?? input).trim();

    if (!content) return;

    if (content.length > 4000) {
      showError("A message cannot contain more than 4000 characters.");
      return;
    }

    const userMessage: AIHealthChatMessage = {
      id: createId(),
      role: "user",
      content,
    };

    const nextMessages = [...apiMessages, { role: "user" as const, content }];
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSavedHistory(null);
    setIsSending(true);

    try {
      const response = await sendAIHealthMessage(nextMessages);
      const assistantMessage: AIHealthChatMessage = {
        id: createId(),
        role: "assistant",
        content: response.assistant.reply,
        assistant: response.assistant,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error: unknown) {
      showError(
        getErrorMessage(error, "The AI assistant could not respond."),
      );
    } finally {
      setIsSending(false);
    }
  };

  const createSummary = async () => {
    if (
      accessState !== "allowed" ||
      !hasUserMessage ||
      isSummarizing ||
      isSending
    ) {
      return;
    }

    setIsSummarizing(true);

    try {
      const response = await generateAIHealthSummary(apiMessages);
      setSavedHistory(response.history);
      showSuccess(response.message);
    } catch (error: unknown) {
      showError(
        getErrorMessage(error, "The summary could not be generated."),
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const resetConversation = () => {
    if (isSending || isSummarizing) return;
    setMessages([welcomeMessage]);
    setInput("");
    setSavedHistory(null);
    showSuccess("A new health conversation has started.");
  };

  return (
    <main className="min-h-screen bg-[#FFF9F9] px-3 py-5 dark:bg-[#211B27] sm:px-5 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-5 sm:space-y-6">
        <header className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
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

              <h1 className="mt-4 max-w-full break-words text-3xl font-black tracking-tight text-slate-950 [overflow-wrap:anywhere] dark:text-white sm:text-4xl lg:text-5xl">
                SebaSathi AI Health Assistant
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-[#A997AE] sm:text-base">
                Describe your symptoms in Bangla, Banglish or English. The AI
                can suggest safe next steps and suitable specialist categories,
                but it cannot diagnose or prescribe treatment.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              {accessState === "allowed" && (
                <button
                  type="button"
                  onClick={resetConversation}
                  disabled={isSending || isSummarizing}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#C5B3D3] px-4 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
                >
                  <LuEraser className="size-4" />
                  New conversation
                </button>
              )}

              <button
                type="button"
                onClick={() => void createSummary()}
                disabled={
                  accessState !== "allowed" ||
                  !hasUserMessage ||
                  isSending ||
                  isSummarizing
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#745D83] px-4 text-sm font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#C5B3D3] dark:text-[#211B27]"
              >
                {isSummarizing ? (
                  <LuLoaderCircle className="size-4 animate-spin" />
                ) : (
                  <LuClipboardPlus className="size-4" />
                )}
                Generate & Save Summary
              </button>
            </div>
          </div>

          <div className="border-t border-[#F5CBCB] bg-[#FBEFEF]/65 px-5 py-3 text-xs font-semibold leading-5 text-[#614E70] dark:border-[#41354A] dark:bg-[#352B3D]/70 dark:text-[#CDBFD0] sm:px-7">
            <LuTriangleAlert className="mr-2 inline size-4 align-text-bottom text-amber-600" />
            For severe chest pain, breathing difficulty, unconsciousness,
            seizures, heavy bleeding, stroke signs, or self-harm risk, seek
            immediate emergency care instead of waiting for AI advice.
          </div>
        </header>

        {accessState === "loading" ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233]">
            <LuLoaderCircle className="size-10 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
          </div>
        ) : accessState !== "allowed" ? (
          <AccessStateCard state={accessState} message={accessMessage} />
        ) : (
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            <section className="flex min-h-[650px] min-w-0 flex-col overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:min-h-[720px]">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#F5CBCB] px-4 py-4 dark:border-[#41354A] sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]">
                    <LuMessageCircleHeart className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-black text-slate-950 dark:text-white">
                      {userName ? `Health chat for ${userName}` : "Health chat"}
                    </h2>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                      Active account access verified
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#FBEFEF] px-3 py-1.5 text-xs font-black text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                  <LuBot className="size-4" />
                  AI online
                </span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-slate-50/45 p-3 sm:space-y-5 sm:p-5 dark:bg-[#211B27]/35">
                {messages.map((message) => (
                  <AIChatMessage key={message.id} message={message} />
                ))}

                {isSending && (
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-2xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]">
                      <LuBrainCircuit className="size-4" />
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#F5CBCB] bg-white px-4 py-3 text-sm font-bold text-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-[#F5CBCB]">
                      <LuLoaderCircle className="size-4 animate-spin" />
                      Reviewing your symptoms...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {apiMessages.length === 0 && (
                <div className="border-t border-[#F5CBCB] px-4 py-3 dark:border-[#41354A] sm:px-5">
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                    Try a quick example
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="shrink-0 rounded-full border border-[#C5B3D3] bg-[#FBEFEF] px-3 py-2 text-xs font-bold text-[#614E70] transition hover:bg-[#FFE2E2] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-[#F5CBCB] p-3 dark:border-[#41354A] sm:p-4">
                <div className="flex min-w-0 items-end gap-2 rounded-2xl border border-[#E4D5E7] bg-white p-2 transition focus-within:border-[#745D83] focus-within:ring-4 focus-within:ring-[#745D83]/10 dark:border-[#41354A] dark:bg-[#352B3D]">
                  <textarea
                    value={input}
                    maxLength={4000}
                    rows={2}
                    disabled={isSending || isSummarizing}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Describe symptoms, duration, severity, age range, and anything that makes them better or worse..."
                    className="max-h-40 min-h-12 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white"
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
                <div className="mt-2 flex flex-col gap-1 text-[11px] font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>Enter to send · Shift + Enter for a new line</span>
                  <span>{input.length}/4000</span>
                </div>
              </div>
            </section>

            <div className="min-w-0 space-y-5">
              {savedHistory ? (
                <AIHealthSummaryCard
                  report={savedHistory.report}
                  historyId={savedHistory.id}
                />
              ) : (
                <aside className="min-w-0 overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white p-5 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                    <LuClipboardPlus className="size-6" />
                  </span>
                  <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                    Conversation summary report
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-[#A997AE]">
                    After discussing your symptoms, click Generate & Save
                    Summary. A short structured report will appear here and be
                    securely stored for your future dashboard history.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      [LuHeartPulse, "Reported symptoms and concerns"],
                      [LuStethoscope, "Suggested doctor specialties"],
                      [LuShieldCheck, "Urgency and warning signs"],
                      [LuClipboardPlus, "Questions to discuss with a doctor"],
                    ].map(([Icon, label]) => {
                      const ItemIcon = Icon as typeof LuHeartPulse;
                      return (
                        <div
                          key={label as string}
                          className="flex items-center gap-3 rounded-2xl bg-[#FBEFEF]/70 p-3 text-sm font-bold text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                        >
                          <ItemIcon className="size-4 shrink-0" />
                          <span>{label as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              )}

              <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/25">
                <h2 className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
                  <LuTriangleAlert className="size-5" />
                  Important limitation
                </h2>
                <p className="mt-2 text-sm leading-7 text-amber-800 dark:text-amber-200">
                  AI may make mistakes. Do not use this assistant as a diagnosis,
                  prescription, emergency service, or replacement for an
                  in-person medical evaluation.
                </p>
              </aside>

              <Link
                href="/doctors"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#C5B3D3] bg-white px-4 text-sm font-black text-[#614E70] transition hover:bg-[#FBEFEF] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
              >
                <LuStethoscope className="size-5" />
                Browse SebaSathi Doctors
              </Link>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        limit={3}
      />
    </main>
  );
};

export default AIHealthAssistant;