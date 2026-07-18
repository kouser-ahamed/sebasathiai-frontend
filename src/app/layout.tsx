import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SebaSathi AI",
    template: "%s | SebaSathi AI",
  },
  description:
    "SebaSathi AI connects patients with verified doctors through online consultations, AI-assisted health guidance, digital prescriptions, appointments and referral support.",
};

const themeScript = `
  (function () {
    try {
      var savedTheme = localStorage.getItem("theme");

      var theme =
        savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : "dark";

      var root = document.documentElement;
      var isDark = theme === "dark";

      root.classList.toggle("dark", isDark);
      root.style.colorScheme = theme;

      if (!savedTheme) {
        localStorage.setItem("theme", theme);
      }
    } catch (error) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[#FBEFEF] antialiased dark:bg-[#211B27]`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body className="min-h-full bg-[#FBEFEF] text-slate-900 transition-colors duration-300 dark:bg-[#211B27] dark:text-[#F7EFF8]">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
