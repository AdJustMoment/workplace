import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdJustMoment",
  description: "AdJustMoment Research Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="drawer lg:drawer-open">
            <input id="drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-base-100">
              <div className="navbar lg:hidden">
                <div className="flex-none">
                  <label
                    htmlFor="drawer"
                    className="btn btn-square btn-ghost drawer-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-5 h-5 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
              </div>
              <main className="flex-1 p-4">{children}</main>
            </div>
            <Sidebar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
