"use client";

import Link from "next/link";
import {
  LuArrowRight,
  LuBot,
  LuBrain,
  LuCircleAlert,
  LuCircleHelp,
  LuDatabase,
  LuHeartPulse,
  LuRoute,
  LuShieldAlert,
  LuSparkles,
  LuStethoscope,
  LuUserRound,
} from "react-icons/lu";

import type { AIHealthChatMessage, AIHealthUrgency } from "./types";

interface AIChatMessageProps {
  message: AIHealthChatMessage;
  isBusy?: boolean;
  onSuggestedPrompt?: (prompt: string) => void;
}

const urgencyTextClasses: Record<AIHealthUrgency, string> = {
  routine: "text-emerald-700 dark:text-emerald-300",
  soon: "text-blue-700 dark:text-blue-300",
  urgent: "text-amber-700 dark:text-amber-300",
  emergency: "text-red-700 dark:text-red-300",
};

const urgencyLabels: Record<AIHealthUrgency, string> = {
  routine: "Routine guidance",
  soon: "Arrange medical advice soon",
  urgent: "Urgent medical attention advised",
  emergency: "Emergency care advised",
};

const AIChatMessage = ({
  message,
  isBusy = false,
  onSuggestedPrompt,
}: AIChatMessageProps) => {
  const isUser = message.role === "user";
  const assistant = message.assistant;

  return (
    <article
      className={`flex min-w-0 items-start gap-2.5 sm:gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27] sm:size-9">
          <LuBot className="size-4" />
        </span>
      )}

      <div
        className={`min-w-0 max-w-[90%] overflow-hidden rounded-2xl px-4 py-3.5 text-sm leading-7 sm:max-w-[84%] sm:px-5 sm:py-4 lg:max-w-[80%] ${
          isUser
            ? "rounded-br-md bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
            : "rounded-bl-md bg-[#FBEFEF] text-slate-700 dark:bg-[#352B3D] dark:text-[#E7DDE8]"
        }`}
      >
        <p className="max-w-full whitespace-pre-wrap break-words text-[14px] leading-7 [overflow-wrap:anywhere] sm:text-[15px]">
          {message.content}
          {message.isStreaming && (
            <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-[#745D83] align-middle dark:bg-[#F5CBCB]" />
          )}
        </p>

        {!isUser && assistant && !message.isWelcome && (
          <div className="mt-4 space-y-4 border-t border-[#E8D7E9] pt-4 dark:border-[#55445F]">
            <p
              className={`text-xs font-black ${urgencyTextClasses[assistant.urgencyLevel]}`}
            >
              {urgencyLabels[assistant.urgencyLevel]}
            </p>

            {assistant.decisionBasis && (
              <div className="flex min-w-0 items-start gap-2">
                <LuBrain className="mt-1 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                <p className="min-w-0 break-words text-sm leading-6 [overflow-wrap:anywhere]">
                  <span className="font-black text-slate-900 dark:text-white">
                    Why this guidance:
                  </span>{" "}
                  {assistant.decisionBasis}
                </p>
              </div>
            )}

            {assistant.suggestedSpecialists.length > 0 && (
              <div className="flex min-w-0 items-start gap-2">
                <LuStethoscope className="mt-1 size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                <p className="min-w-0 break-words text-sm leading-6 [overflow-wrap:anywhere]">
                  <span className="font-black text-slate-900 dark:text-white">
                    Suitable doctor:
                  </span>{" "}
                  {assistant.suggestedSpecialists.join(", ")}
                </p>
              </div>
            )}

            {assistant.recommendedActions.length > 0 && (
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <LuHeartPulse className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                  What you can do now
                </p>
                <ul className="mt-2 space-y-1.5 pl-6 text-sm leading-6">
                  {assistant.recommendedActions.map((item) => (
                    <li
                      key={item}
                      className="list-disc break-words [overflow-wrap:anywhere]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assistant.warningSigns.length > 0 && (
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-red-700 dark:text-red-300">
                  <LuShieldAlert className="size-4 shrink-0" />
                  Seek urgent care if
                </p>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-red-700 dark:text-red-200">
                  {assistant.warningSigns.map((item) => (
                    <li key={item} className="flex min-w-0 gap-2">
                      <LuCircleAlert className="mt-1.5 size-3.5 shrink-0" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assistant.followUpQuestions.length > 0 && (
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <LuCircleHelp className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                  Useful follow-up questions
                </p>
                <ul className="mt-2 space-y-1.5 pl-6 text-sm leading-6">
                  {assistant.followUpQuestions.map((item) => (
                    <li
                      key={item}
                      className="list-disc break-words [overflow-wrap:anywhere]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assistant.navigationActions.length > 0 && (
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <LuRoute className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                  Relevant SebaSathi pages
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assistant.navigationActions.map((action) => (
                    <Link
                      key={`${action.href}-${action.label}`}
                      href={action.href}
                      title={action.reason}
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#C5B3D3] bg-white px-3 py-1.5 text-xs font-black text-[#614E70] transition hover:bg-[#FFE2E2] dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB] dark:hover:bg-[#41354A]"
                    >
                      {action.label}
                      <LuArrowRight className="size-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {assistant.suggestedPrompts.length > 0 && onSuggestedPrompt && (
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <LuSparkles className="size-4 shrink-0 text-[#745D83] dark:text-[#F5CBCB]" />
                  Suggested next messages
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assistant.suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSuggestedPrompt(prompt)}
                      className="max-w-full rounded-full border border-[#C5B3D3] bg-white px-3 py-1.5 text-left text-xs font-bold leading-5 text-[#614E70] transition hover:bg-[#FFE2E2] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#745D83] dark:bg-[#2A2233] dark:text-[#F5CBCB] dark:hover:bg-[#41354A]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(assistant.toolsUsed.length > 0 ||
              assistant.contextMemoryUsed) && (
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-[#A997AE]">
                <LuDatabase className="size-3.5 shrink-0" />
                <span>Context used:</span>
                {assistant.contextMemoryUsed && (
                  <span className="rounded-full bg-white/80 px-2 py-0.5 dark:bg-[#2A2233]">
                    Conversation memory
                  </span>
                )}
                {assistant.toolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-white/80 px-2 py-0.5 dark:bg-[#2A2233]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <p className="break-words text-[11px] italic leading-5 text-slate-400 [overflow-wrap:anywhere] dark:text-[#A997AE]">
              {assistant.disclaimer}
            </p>
          </div>
        )}
      </div>

      {isUser && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F5CBCB] text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB] sm:size-9">
          <LuUserRound className="size-4" />
        </span>
      )}
    </article>
  );
};

export default AIChatMessage;
