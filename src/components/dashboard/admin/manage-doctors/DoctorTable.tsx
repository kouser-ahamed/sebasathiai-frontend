"use client";

import { LuBan, LuCircleCheck, LuPencil, LuTrash2 } from "react-icons/lu";

import type { Doctor, DoctorStatus } from "./types";

interface DoctorTableProps {
  doctors: Doctor[];
  readOnly: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  onStatusChange: (doctor: Doctor, status: DoctorStatus) => void;
}

const DoctorAvatar = ({ doctor }: { doctor: Doctor }) => {
  const initial = doctor.name.trim().charAt(0).toUpperCase() || "D";

  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#C5B3D3] bg-[#FBEFEF] text-sm font-black text-[#745D83] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
      {doctor.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={doctor.image}
          alt={doctor.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
};

const DoctorTable = ({
  doctors,
  readOnly,
  onEdit,
  onDelete,
  onStatusChange,
}: DoctorTableProps) => {
  if (!doctors.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#C5B3D3] bg-white p-10 text-center dark:border-[#745D83] dark:bg-[#2A2233]">
        <h3 className="font-black text-slate-900 dark:text-white">
          No doctors found
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-[#A997AE]">
          Add a doctor or change the current search filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-[#FBEFEF] text-xs uppercase tracking-wide text-[#614E70] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
              <tr>
                <th className="px-5 py-4">Doctor</th>
                <th className="px-5 py-4">Specialization</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F5CBCB] dark:divide-[#41354A]">
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="transition hover:bg-[#FBEFEF]/60 dark:hover:bg-[#352B3D]/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <DoctorAvatar doctor={doctor} />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900 dark:text-white">
                          {doctor.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-[#A997AE]">
                          {doctor.email}
                        </p>
                        {doctor.phone && (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#A997AE]">
                            {doctor.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-700 dark:text-[#E7DDE8]">
                      {doctor.specialization || "Not set"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#A997AE]">
                      {doctor.qualification || "No qualification provided"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-[#D8CADA]">
                    {doctor.experienceYears} years
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                        doctor.status === "active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400"
                          : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(doctor)}
                        disabled={readOnly}
                        title={readOnly ? "Read-only account" : "Edit doctor"}
                        className="flex size-9 items-center justify-center rounded-xl border border-[#E4D5E7] text-[#745D83] transition hover:border-[#C5B3D3] hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#5D4C69] dark:text-[#F5CBCB] dark:hover:bg-[#352B3D]"
                        aria-label={`Edit ${doctor.name}`}
                      >
                        <LuPencil className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(
                            doctor,
                            doctor.status === "active" ? "blocked" : "active",
                          )
                        }
                        disabled={readOnly}
                        title={
                          readOnly
                            ? "Read-only account"
                            : doctor.status === "active"
                              ? "Block doctor"
                              : "Activate doctor"
                        }
                        className={`flex size-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          doctor.status === "active"
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-400"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-400"
                        }`}
                        aria-label={
                          doctor.status === "active"
                            ? `Block ${doctor.name}`
                            : `Activate ${doctor.name}`
                        }
                      >
                        {doctor.status === "active" ? (
                          <LuBan className="size-4" />
                        ) : (
                          <LuCircleCheck className="size-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(doctor)}
                        disabled={readOnly}
                        title={readOnly ? "Read-only account" : "Delete doctor"}
                        className="flex size-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/25"
                        aria-label={`Delete ${doctor.name}`}
                      >
                        <LuTrash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="rounded-3xl border border-[#F5CBCB] bg-white p-4 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]"
          >
            <div className="flex items-start gap-3">
              <DoctorAvatar doctor={doctor} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-black text-slate-900 dark:text-white">
                      {doctor.name}
                    </h3>
                    <p className="truncate text-xs text-slate-500 dark:text-[#A997AE]">
                      {doctor.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${
                      doctor.status === "active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-400"
                        : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/25 dark:text-red-400"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </div>

                <div className="mt-3 text-xs">
                  <div>
                    <p className="text-slate-400 dark:text-[#A997AE]">
                      Specialization
                    </p>
                    <p className="mt-1 font-semibold text-slate-700 dark:text-[#E7DDE8]">
                      {doctor.specialization || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#F5CBCB] pt-4 dark:border-[#41354A]">
              <button
                type="button"
                onClick={() => onEdit(doctor)}
                disabled={readOnly}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E4D5E7] text-xs font-bold text-[#745D83] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#5D4C69] dark:text-[#F5CBCB]"
              >
                <LuPencil className="size-4" /> Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    doctor,
                    doctor.status === "active" ? "blocked" : "active",
                  )
                }
                disabled={readOnly}
                className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                  doctor.status === "active"
                    ? "border-amber-200 text-amber-700 dark:border-amber-900/60 dark:text-amber-400"
                    : "border-emerald-200 text-emerald-700 dark:border-emerald-900/60 dark:text-emerald-400"
                }`}
              >
                {doctor.status === "active" ? (
                  <LuBan className="size-4" />
                ) : (
                  <LuCircleCheck className="size-4" />
                )}
                {doctor.status === "active" ? "Block" : "Activate"}
              </button>

              <button
                type="button"
                onClick={() => onDelete(doctor)}
                disabled={readOnly}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400"
              >
                <LuTrash2 className="size-4" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default DoctorTable;
