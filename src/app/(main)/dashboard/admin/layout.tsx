import type { ReactNode } from "react";

import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({
  children,
}: Readonly<AdminLayoutProps>) => {
  await requireRole("admin");

  return <>{children}</>;
};

export default AdminLayout;