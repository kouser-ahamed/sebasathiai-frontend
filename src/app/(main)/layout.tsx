import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Readonly<MainLayoutProps>) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBEFEF] text-slate-900 transition-colors duration-300 dark:bg-[#211B27] dark:text-[#F7EFF8]">
      <Navbar />

      <main className="min-h-0 flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
