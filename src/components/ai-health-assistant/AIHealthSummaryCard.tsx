"use client";

import {
  LuActivity,
  LuBadgeCheck,
  LuCircleAlert,
  LuClipboardList,
  LuHeartPulse,
  LuShieldAlert,
  LuStethoscope,
} from "react-icons/lu";

import type {
  AIHealthSummaryReport,
  AIHealthUrgency,
} from "./types";

interface AIHealthSummaryCardProps {
  report: AIHealthSummaryReport;
  historyId: string;
}

const urgencyClasses: Record<AIHealthUrgency, string> = {
  routine: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  soon: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  urgent: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  emergency: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
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
  if (items.length === 0) return null;

  return (
    <section>
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#745D83] dark:text-[#F5CBCB]">
        <Icon className="size-4" />
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600 dark:text-[#CDBFD0]">
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

const AIHealthSummaryCard = ({
  report,
  historyId,
}: AIHealthSummaryCardProps) => {
  return (
    <aside className="min-w-0 overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] sm:p-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#745D83] dark:text-[#F5CBCB]">
            Saved report
          </p>
          <h2 className="mt-1 max-w-full break-words text-xl font-black text-slate-950 [overflow-wrap:anywhere] dark:text-white">
            {report.reportTitle}
          </h2>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black capitalize ${urgencyClasses[report.urgencyLevel]}`}
        >
          {report.urgencyLevel}
        </span>
      </div>

      <p className="mt-4 max-w-full whitespace-pre-wrap break-words rounded-2xl bg-[#FBEFEF] p-4 text-sm font-semibold leading-6 text-slate-700 [overflow-wrap:anywhere] dark:bg-[#352B3D] dark:text-[#E7DDE8]">
        {report.conciseSummary}
      </p>

      <div className="mt-5 space-y-5">
        <ReportList title="Chief concerns" items={report.chiefConcerns} icon={LuClipboardList} />
        <ReportList title="Reported symptoms" items={report.symptoms} icon={LuActivity} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-[#F5CBCB] p-3 dark:border-[#41354A]">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Duration & pattern</p>
            <p className="mt-1 max-w-full break-words text-sm font-semibold leading-6 text-slate-700 [overflow-wrap:anywhere] dark:text-[#E7DDE8]">
              {report.durationAndPattern}
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-[#F5CBCB] p-3 dark:border-[#41354A]">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Severity</p>
            <p className="mt-1 max-w-full break-words text-sm font-semibold leading-6 text-slate-700 [overflow-wrap:anywhere] dark:text-[#E7DDE8]">
              {report.severity}
            </p>
          </div>
        </div>

        <ReportList title="Suggested specialists" items={report.suggestedSpecialists} icon={LuStethoscope} />
        <ReportList title="General self-care guidance" items={report.selfCareGuidance} icon={LuHeartPulse} />
        <ReportList title="Questions for your doctor" items={report.questionsForDoctor} icon={LuBadgeCheck} />

        {report.redFlags.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/25">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-red-600 dark:text-red-300">
              <LuCircleAlert className="size-4" />
              Red flags
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-6 text-red-700 dark:text-red-200">
              {report.redFlags.map((item) => (
                <li key={item} className="min-w-0 break-words [overflow-wrap:anywhere]">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-300">
            <LuShieldAlert className="size-4" />
            Emergency advice
          </p>
          <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-6 text-amber-800 [overflow-wrap:anywhere] dark:text-amber-200">
            {report.emergencyAdvice}
          </p>
        </div>

        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500 dark:bg-[#352B3D] dark:text-[#A997AE]">
          {report.disclaimer}
        </p>
      </div>

      <p className="mt-4 break-all text-[10px] font-semibold text-slate-300 dark:text-[#74647B]">
        History ID: {historyId}
      </p>
    </aside>
  );
};

export default AIHealthSummaryCard;