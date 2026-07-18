import type { ReactNode } from "react";

import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DoctorLayoutProps {
  children: ReactNode;
}

const DoctorLayout = async ({
  children,
}: Readonly<DoctorLayoutProps>) => {
  await requireRole("doctor");

  return <>{children}</>;
};

export default DoctorLayout;