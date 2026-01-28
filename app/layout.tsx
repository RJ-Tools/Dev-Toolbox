import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { AdPlaceholder } from "@/components/ad-placeholder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developer Tools",
  description: "One-stop solution for developer tools",
  icons: {
    icon: [
      { url: "/dev-tools-favicon.png", sizes: "any" },
      { url: "/dev-tools-favicon.png", type: "image/png" },
    ],
    shortcut: "/dev-tools-favicon.png",
    apple: "/dev-tools-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "sunset", "winter", "spring", "autumn", "space", "ocean"]}
        >
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
              <SiteHeader />
              <main className="flex-1 flex flex-col overflow-y-auto w-full p-4 lg:p-6 pb-0">
                {children}
              </main>
              <AdPlaceholder />
              <Toaster />
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
