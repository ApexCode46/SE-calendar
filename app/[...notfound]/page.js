"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CatchAllPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/calendar");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push("/calendar");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Animation */}
        <div className="relative mb-8">
          <div className="text-6xl sm:text-7xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-800 bg-clip-text animate-pulse">
            ⚠️ 404
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            ไม่พบเส้นทางที่คุณต้องการ
          </h1>

          {/* Current Path Display */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              เส้นทางที่คุณพยายามเข้าถึง:
            </p>
            <code className="text-red-600 font-mono text-sm sm:text-base break-all">
              {pathname}
            </code>
          </div>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            เส้นทางนี้ไม่มีอยู่ในระบบ SE Calendar
            <br className="hidden sm:block" />
            กำลังพาคุณกลับไปหน้าปฏิทินหลัก
          </p>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-blue-800 mb-3">
              <span className="text-xl">🔄</span>
              <span className="font-medium">
                กำลังเปลี่ยนเส้นทางใน {countdown} วินาที
              </span>
            </div>

            {/* Animated Progress */}
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-linear relative"
                style={{ width: `${((8 - countdown) / 8) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">📅</span>
              ไปหน้าปฏิทิน
            </button>

            <button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">⬅️</span>
              กลับหน้าก่อน
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center mb-2">
            <span className="mr-2">💡</span>
            หากคุณคิดว่านี่เป็นข้อผิดพลาด กลับติดต่อผู้ดูแลระบบ
          </p>
          <p className="flex items-center justify-center">
            <span className="mr-2">📅</span>
            SE Calendar v1.0
          </p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-200 rounded-full opacity-10 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-10 animate-bounce"></div>
      </div>
    </div>
  );
}
