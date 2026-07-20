"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiUserX,
  FiActivity,
} from "react-icons/fi";

import {
  LuStethoscope,
  LuHeartPulse,
  LuClock,
  LuCalendarCheck,
  LuUsersRound,
} from "react-icons/lu";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiXCircle } from "react-icons/bi";

interface DashboardStats {
  overview: {
    totalPatients: number;
    activePatients: number;
    blockedPatients: number;
    totalDoctors: number;
    activeDoctors: number;
    blockedDoctors: number;
    totalAppointments: number;
    completedConsultations: number;
    appointmentStatus: {
      pending: number;
      approved: number;
      completed: number;
      rejected: number;
    };
  };
  charts: {
    appointmentStatus: Array<{
      name: string;
      value: number;
      fill: string;
    }>;
    monthlyTrends: Array<{
      month: string;
      pending: number;
      approved: number;
      completed: number;
      rejected: number;
      total: number;
    }>;
  };
  recentAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    createdAt: Date;
  }>;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const STATUS_COLORS = {
  pending: "bg-yellow-500 text-yellow-50",
  approved: "bg-blue-500 text-blue-50",
  completed: "bg-green-500 text-green-50",
  rejected: "bg-red-500 text-red-50",
};

const STATUS_ICONS = {
  pending: LuClock,
  approved: FiCheckCircle,
  completed: FaRegCheckCircle,
  rejected: BiXCircle,
};

// Helper function to get token from cookies
const getTokenFromCookies = () => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'better-auth-token' || name === 'token' || name.includes('auth')) {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const AdminOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // First try to get token from localStorage
        let token = localStorage.getItem("token");
        
        // If not in localStorage, try to get from cookies
        if (!token) {
          token = getTokenFromCookies();
        }
        
        // If still no token, try to get from session
        if (!token) {
          try {
            const sessionResponse = await fetch("/api/auth/get-session", {
              credentials: "include",
            });
            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              if (sessionData?.session?.token) {
                token = sessionData.session.token;
                // Store it for future use
                localStorage.setItem("token", token);
              }
            }
          } catch (sessionError) {
            console.error("Failed to get session:", sessionError);
          }
        }

        if (!token) {
          // If still no token, redirect to login
          window.location.href = "/auth/login?callbackURL=/dashboard/admin";
          return;
        }

        console.log("Fetching dashboard stats with token...");
        
        const response = await fetch("/api/v1/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem("token");
          window.location.href = "/auth/login?callbackURL=/dashboard/admin";
          return;
        }

        if (response.status === 404) {
          setError("Dashboard API endpoint not found. Please check if the backend route is properly configured.");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard statistics (Status: ${response.status})`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch dashboard statistics");
        }

        if (!data.data) {
          throw new Error("No data received from server");
        }

        setStats(data.data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiLoader className="size-12 animate-spin text-[#745D83] dark:text-[#F5CBCB]" />
        <p className="text-lg font-semibold text-slate-700 dark:text-[#D8CADB]">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiAlertCircle className="size-12 text-red-500" />
        <p className="text-lg font-semibold text-red-500 text-center max-w-2xl">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-xl bg-[#745D83] text-white font-bold hover:bg-[#614E70] transition"
          >
            Retry
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth/login?callbackURL=/dashboard/admin";
            }}
            className="px-6 py-2 rounded-xl border border-[#745D83] text-[#745D83] font-bold hover:bg-[#745D83] hover:text-white transition"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-semibold text-slate-700 dark:text-[#D8CADB]">
          No data available
        </p>
      </div>
    );
  }

  const { overview, charts, recentAppointments } = stats;
  const appointmentStatus = overview.appointmentStatus;

  // Overview cards data
  const overviewCards = [
    {
      title: "Total Patients",
      value: overview.totalPatients,
      icon: FiUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Doctors",
      value: overview.totalDoctors,
      icon: LuStethoscope,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Appointments",
      value: overview.totalAppointments,
      icon: FiCalendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Completed Consultations",
      value: overview.completedConsultations,
      icon: FiCheckCircle,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  // User status cards
  const userStatusCards = [
    {
      title: "Active Patients",
      value: overview.activePatients,
      total: overview.totalPatients,
      icon: FiUser,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
      textColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Blocked Patients",
      value: overview.blockedPatients,
      total: overview.totalPatients,
      icon: FiUserX,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Active Doctors",
      value: overview.activeDoctors,
      total: overview.totalDoctors,
      icon: FiUser,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Blocked Doctors",
      value: overview.blockedDoctors,
      total: overview.totalDoctors,
      icon: FiUserX,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  // Appointment status cards
  const statusCards = [
    {
      title: "Pending",
      value: appointmentStatus.pending,
      icon: LuClock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Approved",
      value: appointmentStatus.approved,
      icon: FiCheckCircle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: appointmentStatus.completed,
      icon: FaRegCheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Rejected",
      value: appointmentStatus.rejected,
      icon: BiXCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  // Calculate percentages
  const totalAppointments = overview.totalAppointments || 1;
  const statusPercentages = {
    pending: Math.round((appointmentStatus.pending / totalAppointments) * 100),
    approved: Math.round((appointmentStatus.approved / totalAppointments) * 100),
    completed: Math.round((appointmentStatus.completed / totalAppointments) * 100),
    rejected: Math.round((appointmentStatus.rejected / totalAppointments) * 100),
  };

  // Calculate user percentages
  const patientActivePercentage = overview.totalPatients > 0 
    ? Math.round((overview.activePatients / overview.totalPatients) * 100) 
    : 0;
  const doctorActivePercentage = overview.totalDoctors > 0 
    ? Math.round((overview.activeDoctors / overview.totalDoctors) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`group rounded-3xl border border-[#F5CBCB] ${card.bgColor} p-6 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-[#41354A] dark:bg-[#2A2233]/90`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-[#D8CADB]">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white`}>
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Status Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {userStatusCards.map((card, index) => {
          const Icon = card.icon;
          const percentage = card.total > 0 ? Math.round((card.value / card.total) * 100) : 0;
          return (
            <div
              key={index}
              className={`group rounded-3xl border border-[#F5CBCB] ${card.bgColor} p-6 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-[#41354A] dark:bg-[#2A2233]/90`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-600 dark:text-[#D8CADB]">
                    {card.title}
                  </p>
                  <p className="text-2xl font-black text-slate-950 dark:text-white">
                    {card.value}
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8D8D8D]">
                    {percentage}% of total
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Status Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          const percentage = statusPercentages[card.title.toLowerCase() as keyof typeof statusPercentages] || 0;
          return (
            <div
              key={index}
              className={`group rounded-3xl border border-[#F5CBCB] ${card.bgColor} p-6 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-[#41354A] dark:bg-[#2A2233]/90`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-600 dark:text-[#D8CADB]">
                    {card.title}
                  </p>
                  <p className="text-2xl font-black text-slate-950 dark:text-white">
                    {card.value}
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#8D8D8D]">
                    {percentage}% of total
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Appointment Status Pie Chart */}
        <div className="rounded-3xl border border-[#F5CBCB] bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]/90">
          <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
            Appointment Status Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.appointmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const percentage = percent ?? 0;
                    return `${name}: ${(percentage * 100).toFixed(0)}%`;
                  }}
                >
                  {charts.appointmentStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    border: "1px solid #F5CBCB",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Stacked Bar Chart */}
        <div className="rounded-3xl border border-[#F5CBCB] bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]/90">
          <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
            Monthly Appointment Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    border: "1px solid #F5CBCB",
                  }}
                />
                <Legend />
                <Bar dataKey="pending" stackId="a" fill="#FBBF24" name="Pending" />
                <Bar dataKey="approved" stackId="a" fill="#60A5FA" name="Approved" />
                <Bar dataKey="completed" stackId="a" fill="#34D399" name="Completed" />
                <Bar dataKey="rejected" stackId="a" fill="#F87171" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Activity Summary */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#F5CBCB] bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]/90">
          <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
            Patient Status Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600 dark:text-[#D8CADB]">
                Active Patients
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  {overview.activePatients}
                </span>
                <span className="text-sm text-slate-500 dark:text-[#8D8D8D]">
                  ({patientActivePercentage}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                style={{ width: `${patientActivePercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600 dark:text-[#D8CADB]">
                Blocked Patients
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  {overview.blockedPatients}
                </span>
                <span className="text-sm text-slate-500 dark:text-[#8D8D8D]">
                  ({100 - patientActivePercentage}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                style={{ width: `${100 - patientActivePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#F5CBCB] bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]/90">
          <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
            Doctor Status Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600 dark:text-[#D8CADB]">
                Active Doctors
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  {overview.activeDoctors}
                </span>
                <span className="text-sm text-slate-500 dark:text-[#8D8D8D]">
                  ({doctorActivePercentage}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${doctorActivePercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600 dark:text-[#D8CADB]">
                Blocked Doctors
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  {overview.blockedDoctors}
                </span>
                <span className="text-sm text-slate-500 dark:text-[#8D8D8D]">
                  ({100 - doctorActivePercentage}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#41354A]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500"
                style={{ width: `${100 - doctorActivePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="rounded-3xl border border-[#F5CBCB] bg-white/80 p-6 backdrop-blur-xl shadow-sm dark:border-[#41354A] dark:bg-[#2A2233]/90">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">
            Recent Appointments
          </h3>
          <span className="text-sm text-slate-500 dark:text-[#8D8D8D]">
            Last {recentAppointments.length} appointments
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F5CBCB] dark:border-[#41354A]">
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-[#D8CADB]">
                  Patient
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-[#D8CADB]">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-[#D8CADB]">
                  Specialization
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-[#D8CADB]">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-[#D8CADB]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => {
                const StatusIcon = STATUS_ICONS[appointment.status as keyof typeof STATUS_ICONS] || FiClock;
                const statusColor = STATUS_COLORS[appointment.status as keyof typeof STATUS_COLORS] || "bg-gray-500 text-gray-50";
                return (
                  <tr
                    key={appointment.id}
                    className="border-b border-[#F5CBCB] hover:bg-[#FBEFEF] dark:border-[#41354A] dark:hover:bg-[#2A2233]/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-[#E7DDE8]">
                      {appointment.patientName}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-[#E7DDE8]">
                      {appointment.doctorName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#D8CADB]">
                      {appointment.specialization}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#D8CADB]">
                      {appointment.appointmentDate} at {appointment.appointmentTime}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>
                        <StatusIcon className="size-3" />
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;