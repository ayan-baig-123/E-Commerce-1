import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Link import karna zaroori hai

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYAN STORE | BEST E-COMMERCE",
  description: "Shop the latest products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-50 min-h-screen antialiased">
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Logo - Click karne par Home par jayega */}
            <Link href="/">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
                AYAN STORE
              </h1>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
                Login
              </Link>
              
              <Link href="/signup" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
                Sign Up
              </Link>

              {/* Add Product Button - Pro Look */}
              <Link href="/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <span className="text-lg">+</span> Add Product
              </Link>
            </div>

          </div>
        </nav>
        
        <main>{children}</main>
      </body>
    </html>
  );
}