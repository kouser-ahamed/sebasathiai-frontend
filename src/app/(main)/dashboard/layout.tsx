import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { getUserSession } from "@/lib/core/session";



export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({
  children,
}: Readonly<DashboardLayoutProps>) => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#FBEFEF] text-slate-900 transition-colors duration-300 dark:bg-[#211B27] dark:text-white">
      <DashboardSideBar user={user} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbar user={user} />

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#FBEFEF] p-4 transition-colors duration-300 dark:bg-[#211B27] sm:p-5 lg:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;