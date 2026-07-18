import type { ReactNode } from "react";

import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PatientLayoutProps {
  children: ReactNode;
}

const PatientLayout = async ({
  children,
}: Readonly<PatientLayoutProps>) => {
  await requireRole("patient");

  return <>{children}</>;
};

export default PatientLayout;