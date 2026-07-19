"use client";

import { useEffect } from "react";
import {
  LuActivity,
  LuBadgeCheck,
  LuBot,
  LuCalendarClock,
  LuCircleAlert,
  LuClipboardList,
  LuHeartPulse,
  LuMessageSquareText,
  LuShieldAlert,
  LuStethoscope,
  LuUserRound,
  LuX,
} from "react-icons/lu";
import { PatientAIHealthHistory, PatientAIHealthUrgency } from "./ types";



interface AIHealthHistoryViewModalProps {
  history: PatientAIHealthHistory | null;
  onClose: () => void;
}

const urgencyClasses: Record<PatientAIHealthUrgency, string> = {
  routine:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  soon: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  urgent:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  emergency: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const ReportList = ({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof LuActivity;
}) => {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233]">
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
        <Icon className="size-4" />
        {title}
      </h4>

      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-[#CDBFD0]">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#745D83] dark:bg-[#F5CBCB]" />
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const AIHealthHistoryViewModal = ({
  history,
  onClose,
}: AIHealthHistoryViewModalProps) => {
  useEffect(() => {
    if (!history) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [history, onClose]);

  if (!history) return null;

  const report = history.report;
  const title =
    history.conversationTitle ||
    report.reportTitle ||
    "AI Health Summary";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-health-history-view-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#F5CBCB] bg-[#FFF9F9] shadow-2xl dark:border-[#41354A] dark:bg-[#211B27]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#F5CBCB] bg-white p-4 dark:border-[#41354A] dark:bg-[#2A2233] sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FBEFEF] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                Saved AI Health History
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${urgencyClasses[report.urgencyLevel]}`}
              >
                {report.urgencyLevel}
              </span>
            </div>

            <h2
              id="ai-health-history-view-title"
              className="mt-3 break-words text-xl font-black text-slate-950 dark:text-white sm:text-2xl"
            >
              {title}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-[#A997AE]">
              <span className="inline-flex items-center gap-1.5">
                <LuUserRound className="size-3.5" />
                {history.patientName || history.userName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuCalendarClock className="size-3.5" />
                Updated {formatDateTime(history.updatedAt || history.createdAt)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] hover:text-slate-700 dark:hover:bg-[#352B3D] dark:hover:text-white"
            aria-label="Close health history details"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">
          <section className="rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-5">
            <p className="text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
              Summary
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-slate-700 [overflow-wrap:anywhere] dark:text-[#E7DDE8]">
              {report.conciseSummary}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FBEFEF] p-4 dark:bg-[#352B3D]">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Duration & pattern
                </p>
                <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-700 dark:text-[#E7DDE8]">
                  {report.durationAndPattern}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FBEFEF] p-4 dark:bg-[#352B3D]">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Severity
                </p>
                <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-700 dark:text-[#E7DDE8]">
                  {report.severity}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ReportList
              title="Chief concerns"
              items={report.chiefConcerns}
              icon={LuClipboardList}
            />
            <ReportList
              title="Reported symptoms"
              items={report.symptoms}
              icon={LuActivity}
            />
            <ReportList
              title="Suggested specialists"
              items={report.suggestedSpecialists}
              icon={LuStethoscope}
            />
            <ReportList
              title="Self-care guidance"
              items={report.selfCareGuidance}
              icon={LuHeartPulse}
            />
            <ReportList
              title="Questions for your doctor"
              items={report.questionsForDoctor}
              icon={LuBadgeCheck}
            />

            {report.redFlags.length > 0 && (
              <section className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/25">
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-red-700 dark:text-red-300">
                  <LuCircleAlert className="size-4" />
                  Red flags
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-red-700 dark:text-red-200">
                  {report.redFlags.map((item) => (
                    <li key={item} className="flex min-w-0 gap-2">
                      <span>•</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-300">
              <LuShieldAlert className="size-4" />
              Emergency advice
            </h4>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-amber-800 dark:text-amber-200">
              {report.emergencyAdvice}
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-5">
            <h3 className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
              <LuMessageSquareText className="size-5 text-[#745D83] dark:text-[#F5CBCB]" />
              Conversation messages
            </h3>

            <div className="mt-4 space-y-3">
              {history.messages.length === 0 ? (
                <p className="rounded-2xl bg-[#FBEFEF] p-4 text-sm font-semibold text-slate-500 dark:bg-[#352B3D] dark:text-[#A997AE]">
                  No conversation messages are available for this saved report.
                </p>
              ) : (
                history.messages.map((message, index) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={`${message.role}-${index}-${message.content.slice(0, 18)}`}
                      className={`flex min-w-0 items-start gap-2.5 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]">
                          <LuBot className="size-4" />
                        </span>
                      )}

                      <div
                        className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 [overflow-wrap:anywhere] sm:max-w-[80%] ${
                          isUser
                            ? "rounded-br-md bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
                            : "rounded-bl-md bg-[#FBEFEF] text-slate-700 dark:bg-[#352B3D] dark:text-[#E7DDE8]"
                        }`}
                      >
                        {message.content}
                      </div>

                      {isUser && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F5CBCB] text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB]">
                          <LuUserRound className="size-4" />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-500 dark:bg-[#2A2233] dark:text-[#A997AE]">
            {report.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIHealthHistoryViewModal;