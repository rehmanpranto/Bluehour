import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import UserMenu from "@/components/UserMenu";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Hour - Mood Logging",
  description: "A gentle, private space to reflect on your moods and emotions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-white text-gray-900 font-inter`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header Navigation */}
          <header className="border-b border-teal-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <nav className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
              <a
                href="/"
                className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent hover:from-teal-700 hover:to-cyan-700 transition"
              >
                🌊 Blue Hour
              </a>
              <div className="flex gap-3 sm:gap-6 md:gap-8 items-center">
                <a
                  href="/checkin"
                  className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-teal-700 transition relative group"
                >
                  <span className="hidden sm:inline">Check-in</span>
                  <span className="sm:hidden">📝</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                <a
                  href="/history"
                  className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-teal-700 transition relative group"
                >
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">📖</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                <a
                  href="/report"
                  className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-teal-700 transition relative group"
                >
                  <span className="hidden md:inline">7-day report</span>
                  <span className="md:hidden">📈</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                <div className="h-4 sm:h-6 w-px bg-gray-300"></div>
                <UserMenu />
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <div className="flex-1">{children}</div>

          {/* Footer */}
          <footer className="border-t border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 py-8 mt-16">
            <div className="mx-auto max-w-6xl px-4 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Made with 💙 for thoughtful reflection.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Your private space for mood logging and self-awareness
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

