"use client";

import { LuCalendarX, LuEye, LuPencil } from "react-icons/lu";
import StatusBadge from "./StatusBadge";
import type { PatientAppointment } from "./types";

interface PatientAppointmentTableProps {
  appointments: PatientAppointment[];
  readOnly: boolean;
  onView: (appointment: PatientAppointment) => void;
  onEdit: (appointment: PatientAppointment) => void;
  onCancel: (appointment: PatientAppointment) => void;
}

const PatientAppointmentTable = ({
  appointments,
  readOnly,
  onView,
  onEdit,
  onCancel,
}: PatientAppointmentTableProps) => (
  <>
    <section className="hidden overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white dark:border-[#41354A] dark:bg-[#2A2233] lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead className="bg-[#FBEFEF] text-xs font-black uppercase tracking-wide text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            <tr>
              <th className="px-5 py-4">Doctor</th>
              <th className="px-5 py-4">Specialization</th>
              <th className="px-5 py-4">Health Problem</th>
              <th className="px-5 py-4">Schedule</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F5CBCB] dark:divide-[#41354A]">
            {appointments.map((appointment) => {
              const initial = appointment.doctorName.trim().charAt(0).toUpperCase() || "D";
              const canEdit = appointment.status === "pending" || appointment.status === "rejected";
              const canCancel = appointment.status !== "completed";

              return (
                <tr key={appointment.id} className="transition hover:bg-[#FBEFEF]/50 dark:hover:bg-[#352B3D]/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F5CBCB] font-black text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB]">
                        {appointment.doctorImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={appointment.doctorImage}
                            alt={appointment.doctorName}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : initial}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-48 truncate font-black text-slate-900 dark:text-white">
                          {appointment.doctorName}
                        </p>
                        <p className="mt-1 max-w-48 truncate text-xs font-semibold text-slate-400">
                          {appointment.hospital}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
                    {appointment.specialization}
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-56 truncate text-sm font-bold text-slate-800 dark:text-[#E7DDE8]">
                      {appointment.problemTitle}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm">
                    <p className="font-black text-slate-800 dark:text-white">{appointment.appointmentDate}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{appointment.appointmentTime}</p>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={appointment.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(appointment)}
                        title="View appointment details"
                        className="flex size-9 items-center justify-center rounded-xl border border-[#C5B3D3] text-[#614E70] transition hover:bg-[#FBEFEF] dark:border-[#745D83] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
                        aria-label={`View appointment with ${appointment.doctorName}`}
                      >
                        <LuEye className="size-4" />
                      </button>

                      <button
                        type="button"
                        disabled={readOnly || !canEdit}
                        onClick={() => onEdit(appointment)}
                        title={
                          readOnly
                            ? "Blocked accounts have read-only access"
                            : canEdit
                              ? "Edit appointment"
                              : "Only pending or rejected appointments can be edited"
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-blue-200 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900/60 dark:text-blue-400 dark:hover:bg-blue-950/25"
                        aria-label={`Edit appointment with ${appointment.doctorName}`}
                      >
                        <LuPencil className="size-4" />
                      </button>

                      <button
                        type="button"
                        disabled={readOnly || !canCancel}
                        onClick={() => onCancel(appointment)}
                        title={
                          readOnly
                            ? "Blocked accounts have read-only access"
                            : canCancel
                              ? "Cancel appointment"
                              : "Completed appointments cannot be cancelled"
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/25"
                        aria-label={`Cancel appointment with ${appointment.doctorName}`}
                      >
                        <LuCalendarX className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-2 lg:hidden">
      {appointments.map((appointment) => {
        const initial = appointment.doctorName.trim().charAt(0).toUpperCase() || "D";
        const canEdit = appointment.status === "pending" || appointment.status === "rejected";
        const canCancel = appointment.status !== "completed";

        return (
          <article key={appointment.id} className="overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
            <div className="flex items-start gap-3 border-b border-[#F5CBCB] p-4 dark:border-[#41354A] sm:p-5">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F5CBCB] text-lg font-black text-[#614E70] dark:bg-[#41354A] dark:text-[#F5CBCB]">
                {appointment.doctorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={appointment.doctorImage}
                    alt={appointment.doctorName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : initial}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-black text-slate-950 dark:text-white sm:text-lg">
                  {appointment.doctorName}
                </h2>
                <p className="mt-1 truncate text-sm font-bold text-[#745D83] dark:text-[#F5CBCB]">
                  {appointment.specialization}
                </p>
                <p className="mt-1 truncate text-xs font-semibold text-slate-400">{appointment.hospital}</p>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-4 flex justify-start"><StatusBadge status={appointment.status} /></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Date</p>
                  <p className="mt-1 font-black text-slate-900 dark:text-white">{appointment.appointmentDate}</p>
                </div>
                <div className="rounded-2xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Time</p>
                  <p className="mt-1 font-black text-slate-900 dark:text-white">{appointment.appointmentTime}</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-[#FBEFEF] p-3 dark:bg-[#352B3D]">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Health Problem</p>
                  <p className="mt-1 line-clamp-2 font-bold text-slate-800 dark:text-[#E7DDE8]">{appointment.problemTitle}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[#F5CBCB] p-4 dark:border-[#41354A] sm:p-5">
              <button type="button" onClick={() => onView(appointment)} className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-[#C5B3D3] text-xs font-black text-[#614E70] dark:border-[#745D83] dark:text-[#F5CBCB]">
                <LuEye className="size-4" /> View
              </button>
              <button type="button" disabled={readOnly || !canEdit} onClick={() => onEdit(appointment)} className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-blue-200 text-xs font-black text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900/60 dark:text-blue-400">
                <LuPencil className="size-4" /> Edit
              </button>
              <button type="button" disabled={readOnly || !canCancel} onClick={() => onCancel(appointment)} className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-red-200 text-xs font-black text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400">
                <LuCalendarX className="size-4" /> Cancel
              </button>
            </div>
          </article>
        );
      })}
    </section>
  </>
);

export default PatientAppointmentTable;