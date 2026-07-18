import {
  LuCalendarCheck,
  LuShieldCheck,
  LuStethoscope,
  LuUsers,
} from "react-icons/lu";

import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DashboardStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const DashboardStatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) => {
  return (
    <article className="rounded-3xl border border-[#F5CBCB] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C5B3D3] hover:shadow-lg hover:shadow-[#C5B3D3]/20 dark:border-[#41354A] dark:bg-[#2A2233] dark:hover:border-[#745D83]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-[#CDBFD0]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>

        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#41354A] dark:text-[#F5CBCB]">
          <Icon className="size-5" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
        {description}
      </p>
    </article>
  );
};

const AdminDashboardPage = async () => {
  const user = await requireRole("admin");

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#F5CBCB] bg-gradient-to-br from-white via-[#FBEFEF] to-[#FFE2E2] p-6 shadow-sm dark:border-[#41354A] dark:from-[#2A2233] dark:via-[#352B3D] dark:to-[#2A2233]">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#745D83] dark:text-[#F5CBCB]">
          Administration
        </p>

        <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
          Welcome, {user.name || "Admin"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#D8CADA]">
          Manage doctors, patients, appointments and the overall SebaSathi AI
          healthcare platform from your admin dashboard.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5B3D3] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#614E70] dark:border-[#745D83] dark:bg-[#211B27]/50 dark:text-[#F5CBCB]">
          <LuShieldCheck className="size-4" />
          Admin Access
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Patients"
          value="0"
          description="Registered patients on the platform."
          icon={LuUsers}
        />

        <DashboardStatCard
          title="Verified Doctors"
          value="0"
          description="Doctors currently verified and active."
          icon={LuStethoscope}
        />

        <DashboardStatCard
          title="Appointments"
          value="0"
          description="Total healthcare appointments."
          icon={LuCalendarCheck}
        />

        <DashboardStatCard
          title="Pending Reviews"
          value="0"
          description="Doctor or account requests requiring review."
          icon={LuShieldCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-[#F5CBCB] bg-white p-6 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Platform Management
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
            User management, doctor verification and platform settings will
            appear here.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-[#C5B3D3] bg-[#FBEFEF] p-6 text-center text-sm font-medium text-[#745D83] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            Admin management modules can be added from the sidebar later.
          </div>
        </article>

        <article className="rounded-3xl border border-[#F5CBCB] bg-white p-6 shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Recent Activities
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#A997AE]">
            Important account and healthcare platform activities will be shown
            here.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-[#C5B3D3] bg-[#FBEFEF] p-6 text-center text-sm font-medium text-[#745D83] dark:border-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            No recent activity is available.
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdminDashboardPage;