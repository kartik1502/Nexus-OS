import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "NEXUS OS — Personal Productivity Ecosystem",
  description:
    "Self-hosted personal productivity OS. Issues tracking, documentation management, and certification tracking — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
