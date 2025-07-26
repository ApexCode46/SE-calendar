"use client";

import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "./components/Nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({ children }) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content="ระบบจองห้องประชุม SE Calendar - จัดการการจองห้องประชุมอย่างมีประสิทธิภาพ" />
        <meta name="keywords" content="จองห้อง, ห้องประชุม, ปฏิทิน, SE Calendar" />
        <meta name="author" content="SE Calendar Team" />
        <title>SE Calendar - ระบบจองห้องประชุม</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50`}>
        <SessionProvider>
          {/* Navigation */}
          <Nav />
          
          {/* Main Content Area */}
          <main className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            
            {/* Content Container */}
            <div className="relative z-10 min-h-screen">
              {/* Page Content */}
              <div className="pt-16">
                {children}
              </div>
              
              {/* Footer */}
              <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Footer Logo */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                        <span className="text-yellow-300 text-sm">📅</span>
                      </div>
                      <span className="text-gray-700 font-semibold">SE Calendar</span>
                    </div>
                    
                    {/* Footer Links */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>© 2025 SE Calendar</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">ระบบจองห้องสาขา</span>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline">เวอร์ชัน 1.0</span>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>🏢</span>
                        <span>Software Engineering</span>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </main>
          
          {/* Background Decorations */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top-left decoration */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full opacity-20 blur-3xl"></div>
            
            {/* Top-right decoration */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
            
            {/* Bottom-left decoration */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-green-100 to-teal-100 rounded-full opacity-20 blur-3xl"></div>
            
            {/* Bottom-right decoration */}
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-orange-100 to-pink-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </SessionProvider>

        {/* Custom Styles */}
        <style jsx global>{`
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          
          /* Smooth scrolling for the entire page */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar for webkit browsers */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #dc2626, #b91c1c);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #b91c1c, #991b1b);
          }
          
          /* Focus styles for better accessibility */
          *:focus {
            outline: 2px solid #dc2626;
            outline-offset: 2px;
          }
          
          /* Print styles */
          @media print {
            .no-print {
              display: none !important;
            }
            
            body {
              background: white !important;
              color: black !important;
            }
            
            .bg-grid-pattern,
            .fixed {
              display: none !important;
            }
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .bg-gradient-to-br {
              background: white !important;
            }
            
            .text-gray-600 {
              color: black !important;
            }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
            
            html {
              scroll-behavior: auto !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}