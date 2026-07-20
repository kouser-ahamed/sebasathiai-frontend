"use client";

import AdminOverview from "@/components/dashboard/admin/overview";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-5">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-950 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-[#D8CADB]">
                Complete platform overview and analytics
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  alert("Export report functionality coming soon!");
                }}
                className="rounded-xl bg-[#745D83] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#614E70]"
              >
                Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="rounded-xl border border-[#745D83] px-4 py-2 text-sm font-bold text-[#745D83] transition hover:bg-[#745D83] hover:text-white dark:border-[#F5CBCB] dark:text-[#F5CBCB] dark:hover:bg-[#F5CBCB] dark:hover:text-[#211B27]"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Admin Overview Component */}
        <AdminOverview />
      </div>
    </div>
  );
};

export default AdminDashboardPage;