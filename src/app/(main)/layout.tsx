"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Readonly<MainLayoutProps>) => {
  const pathname = usePathname();
  const showPublicChrome = !pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-[#FBEFEF] text-slate-900 transition-colors duration-300 dark:bg-[#211B27] dark:text-[#F7EFF8]">
      {showPublicChrome && <Navbar />}

      <main className="flex-1">{children}</main>

      {showPublicChrome && <Footer />}
    </div>
  );
};

export default MainLayout;
