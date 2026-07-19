"use client";

import {
  LuBot,
  LuCircleAlert,
  LuCircleHelp,
  LuHeartPulse,
  LuShieldAlert,
  LuStethoscope,
  LuUserRound,
} from "react-icons/lu";

import type {
  AIHealthChatMessage,
  AIHealthUrgency,
} from "./types";

interface AIChatMessageProps {
  message: AIHealthChatMessage;
}

const urgencyClasses: Record<AIHealthUrgency, string> = {
  routine:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-300",
  soon:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/25 dark:text-blue-300",
  urgent:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300",
  emergency:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-300",
};

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const isUser = message.role === "user";
  const assistant = message.assistant;

  return (
    <article
      className={`flex min-w-0 gap-2.5 sm:gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#745D83] text-white shadow-sm dark:bg-[#C5B3D3] dark:text-[#211B27] sm:size-10">
          <LuBot className="size-4 sm:size-5" />
        </span>
      )}

      <div
        className={`min-w-0 max-w-[88%] overflow-hidden rounded-2xl px-3.5 py-3 sm:max-w-[78%] sm:rounded-3xl sm:px-4 ${
          isUser
            ? "rounded-br-md bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
            : "rounded-bl-md border border-[#F5CBCB] bg-white text-slate-700 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-[#E7DDE8]"
        }`}
      >
        <p className="max-w-full whitespace-pre-wrap break-words text-sm font-medium leading-6 [overflow-wrap:anywhere]">
          {message.content}
        </p>

        {assistant && (
          <div className="mt-4 space-y-3 border-t border-[#F5CBCB] pt-4 dark:border-[#41354A]">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${urgencyClasses[assistant.urgencyLevel]}`}
            >
              {assistant.urgencyLevel} priority
            </span>

            {assistant.suggestedSpecialists.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                  <LuStethoscope className="size-4" />
                  Suggested specialists
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {assistant.suggestedSpecialists.map((item) => (
                    <span
                      key={item}
                      className="max-w-full break-words rounded-full bg-[#FBEFEF] px-3 py-1.5 text-xs font-bold text-[#614E70] [overflow-wrap:anywhere] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {assistant.recommendedActions.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                  <LuHeartPulse className="size-4" />
                  What to do now
                </p>

                <ul className="mt-2 space-y-1.5 text-sm leading-6">
                  {assistant.recommendedActions.map((item) => (
                    <li key={item} className="flex min-w-0 gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#745D83] dark:bg-[#F5CBCB]" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {assistant.warningSigns.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/25">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-red-600 dark:text-red-300">
                  <LuShieldAlert className="size-4" />
                  Warning signs
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
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                  <LuCircleHelp className="size-4" />
                  Helpful follow-up questions
                </p>

                <ul className="mt-2 space-y-1.5 text-sm leading-6">
                  {assistant.followUpQuestions.map((item) => (
                    <li key={item} className="min-w-0 break-words [overflow-wrap:anywhere]">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500 dark:bg-[#352B3D] dark:text-[#A997AE]">
              {assistant.disclaimer}
            </p>
          </div>
        )}
      </div>

      {isUser && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#F5CBCB] text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB] sm:size-10">
          <LuUserRound className="size-4 sm:size-5" />
        </span>
      )}
    </article>
  );
};

export default AIChatMessage;