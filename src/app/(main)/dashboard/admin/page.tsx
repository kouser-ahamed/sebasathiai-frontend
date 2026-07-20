"use client";

import AdminOverview from "@/components/dashboard/admin/AdminOverview/AdminOverview";

const AdminDashboardPage = () => {
  return (
    <div
      className="
min-h-screen
py-8
"
    >
      <div
        className="
mx-auto
max-w-7xl
px-5
"
      >
        <div
          className="
mb-8
"
        >
          <h1
            className="
text-3xl
font-black
text-slate-950

dark:text-white
"
          >
            Admin Dashboard
          </h1>

          <p
            className="
mt-2
text-slate-600
dark:text-[#D8CADB]
"
          >
            Complete platform overview and analytics
          </p>
        </div>

        <AdminOverview />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
