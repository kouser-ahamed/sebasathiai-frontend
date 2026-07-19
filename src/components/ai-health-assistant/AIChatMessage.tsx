"use client";

import { useState } from "react";
import {
  LuBot,
  LuChevronDown,
  LuChevronUp,
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
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  soon:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  urgent:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  emergency:
    "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const AIChatMessage = ({ message }: AIChatMessageProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isUser = message.role === "user";
  const assistant = message.assistant;

  return (
    <article
      className={`flex min-w-0 items-start gap-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27] sm:size-9">
          <LuBot className="size-4" />
        </span>
      )}

      <div
        className={`min-w-0 max-w-[88%] overflow-hidden rounded-2xl px-3.5 py-3 text-sm leading-6 sm:max-w-[78%] ${
          isUser
            ? "rounded-br-md bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
            : "rounded-bl-md border border-[#F5CBCB] bg-white text-slate-700 dark:border-[#41354A] dark:bg-[#2A2233] dark:text-[#E7DDE8]"
        }`}
      >
        <p className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {message.content}
        </p>

        {!isUser && assistant && !message.isWelcome && (
          <div className="mt-3 border-t border-[#F5CBCB] pt-3 dark:border-[#41354A]">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${urgencyClasses[assistant.urgencyLevel]}`}
              >
                {assistant.urgencyLevel}
              </span>

              {assistant.suggestedSpecialists.map((specialist) => (
                <span
                  key={specialist}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FBEFEF] px-2.5 py-1 text-[10px] font-black text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]"
                >
                  <LuStethoscope className="size-3" />
                  {specialist}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#745D83] dark:text-[#F5CBCB]"
            >
              {showDetails ? (
                <LuChevronUp className="size-4" />
              ) : (
                <LuChevronDown className="size-4" />
              )}
              {showDetails ? "Hide details" : "View concise details"}
            </button>

            {showDetails && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {assistant.recommendedActions.length > 0 && (
                  <section className="rounded-xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
                    <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                      <LuHeartPulse className="size-3.5" />
                      What to do now
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5">
                      {assistant.recommendedActions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {assistant.followUpQuestions.length > 0 && (
                  <section className="rounded-xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
                    <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
                      <LuCircleHelp className="size-3.5" />
                      Follow-up
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5">
                      {assistant.followUpQuestions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {assistant.warningSigns.length > 0 && (
                  <section className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/25 md:col-span-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-red-600 dark:text-red-300">
                      <LuShieldAlert className="size-3.5" />
                      Warning signs
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-5 text-red-700 dark:text-red-200">
                      {assistant.warningSigns.map((item) => (
                        <li key={item} className="flex gap-1.5">
                          <LuCircleAlert className="mt-1 size-3 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <p className="text-[10px] leading-4 text-slate-400 md:col-span-2">
                  {assistant.disclaimer}
                </p>
              </div>
            )}
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