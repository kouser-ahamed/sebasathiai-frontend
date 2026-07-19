"use client";

import {
  LuEye,
  LuSettings2,
} from "react-icons/lu";

import type {
  DoctorAppointment,
} from "./types";

interface AppointmentTableProps {
  appointments: DoctorAppointment[];
  readOnly: boolean;
  onView: (
    appointment: DoctorAppointment,
  ) => void;
  onManage: (
    appointment: DoctorAppointment,
  ) => void;
}

const statusClass = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-400",
  approved:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/25 dark:text-blue-400",
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400",
  rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400",
} as const;

const AppointmentTable = ({
  appointments,
  readOnly,
  onView,
  onManage,
}: AppointmentTableProps) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left">
          <thead className="bg-[#FBEFEF] text-xs font-black uppercase tracking-wide text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            <tr>
              <th className="px-5 py-4">Patient</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Health Problem</th>
              <th className="px-5 py-4">Schedule</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F5CBCB] dark:divide-[#41354A]">
            {appointments.map(
              (appointment) => {
                const initial =
                  appointment.patientName
                    .trim()
                    .charAt(0)
                    .toUpperCase() || "P";

                const canManage =
                  appointment.status === "pending" ||
                  appointment.status === "approved";

                return (
                  <tr
                    key={appointment.id}
                    className="transition hover:bg-[#FBEFEF]/50 dark:hover:bg-[#352B3D]/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F5CBCB] font-black text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB]">
                          {appointment.patientImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={appointment.patientImage}
                              alt={appointment.patientName}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            initial
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-44 truncate font-black text-slate-900 dark:text-white">
                            {appointment.patientName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Applied{" "}
                            {appointment.createdAt
                              ? new Date(
                                  appointment.createdAt,
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-[#CDBFD0]">
                      {appointment.patientEmail}
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-52 truncate text-sm font-bold text-slate-800 dark:text-[#E7DDE8]">
                        {appointment.problemTitle}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <p className="font-black text-slate-800 dark:text-white">
                        {appointment.appointmentDate}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {appointment.appointmentTime}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${statusClass[appointment.status]}`}
                      >
                        {appointment.status === "completed"
                          ? "Complete Consultation"
                          : appointment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onView(appointment)
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#C5B3D3] px-3 text-xs font-black text-[#614E70] transition hover:bg-[#FBEFEF] dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
                        >
                          <LuEye className="size-4" />
                          View
                        </button>

                        <button
                          type="button"
                          disabled={readOnly || !canManage}
                          onClick={() =>
                            onManage(appointment)
                          }
                          title={
                            readOnly
                              ? "Blocked accounts have read-only access"
                              : canManage
                                ? "Manage appointment"
                                : "Finalized appointment"
                          }
                          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#745D83] px-3 text-xs font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#C5B3D3] dark:text-[#211B27]"
                        >
                          <LuSettings2 className="size-4" />
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AppointmentTable;