import { redirect } from "next/navigation";

import { getUserSession } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DashboardEntryPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/login");
  }

  redirect(`/dashboard/${user.role}`);
};

export default DashboardEntryPage;