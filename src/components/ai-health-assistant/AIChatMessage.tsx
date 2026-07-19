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

import type { AIHealthChatMessage, AIHealthUrgency } from "./types";

interface AIChatMessageProps {
  message: AIHealthChatMessage;
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

const AIChatMessage = ({ message }: AIChatMessageProps) => {
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
        className={`min-w-0 max-w-[90%] overflow-hidden rounded-2xl px-4 py-3.5 text-sm leading-7 sm:max-w-[82%] sm:px-5 sm:py-4 lg:max-w-[78%] ${
          isUser
            ? "rounded-br-md bg-[#745D83] text-white dark:bg-[#C5B3D3] dark:text-[#211B27]"
            : "rounded-bl-md bg-[#FBEFEF] text-slate-700 dark:bg-[#352B3D] dark:text-[#E7DDE8]"
        }`}
      >
        <p className="max-w-full whitespace-pre-wrap break-words text-[14px] leading-7 [overflow-wrap:anywhere] sm:text-[15px]">
          {message.content}
        </p>

        {!isUser && assistant && !message.isWelcome && (
          <div className="mt-4 space-y-4 border-t border-[#E8D7E9] pt-4 dark:border-[#55445F]">
            <p
              className={`text-xs font-black ${urgencyTextClasses[assistant.urgencyLevel]}`}
            >
              {urgencyLabels[assistant.urgencyLevel]}
            </p>

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
                  A few useful questions
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
