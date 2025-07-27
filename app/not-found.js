"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

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
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl sm:text-9xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-800 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-red-200 blur-sm">
            404
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <span className="text-6xl text-white">🔍</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            ไม่พบหน้าที่คุณต้องการ
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            ขออภัย เราไม่พบหน้าที่คุณกำลังมองหา 
            <br className="hidden sm:block" />
            อาจเป็นเพราะลิงก์ผิดพลาดหรือหน้านี้ไม่มีอยู่จริง
          </p>

          {/* Suggestions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              ข้อเสนอแนะ
            </h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                ตรวจสอบการสะกดของ URL
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                ลองกลับไปหน้าหลักและนำทางใหม่
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                ติดต่อผู้ดูแลระบบหากปัญหายังคงอยู่
              </li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-center justify-center space-x-2 text-amber-800">
              <span className="text-xl">⏰</span>
              <span className="font-medium">
                จะพาคุณกลับไปหน้าปฏิทินใน {countdown} วินาที
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-amber-200 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">🏠</span>
              ไปหน้าปฏิทิน
            </button>
            
            <button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">⬅️</span>
              กลับหน้าที่แล้ว
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <span className="mr-2">📅</span>
            SE Calendar - ระบบจองห้องประชุม
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-20 right-16 w-16 h-16 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-32 right-12 w-14 h-14 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
