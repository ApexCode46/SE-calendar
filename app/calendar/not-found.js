"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CalendarNotFound() {
  const [countdown, setCountdown] = useState(8);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/calendar");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoCalendar = () => {
    router.push("/calendar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-2xl w-full text-center animate-fadeInUp">
          {/* Calendar Icon Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                <span className="text-6xl text-white">📅</span>
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-lg">❓</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100 animate-scaleIn">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              ไม่พบหน้าย่อยในส่วนปฏิทิน
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              หน้าที่คุณต้องการหาไม่อยู่ในระบบปฏิทิน
              <br className="hidden sm:block" />
              กำลังนำคุณกลับไปหน้าปฏิทินหลัก...
            </p>

            {/* Countdown */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-center justify-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg animate-glow">
                    {countdown}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-blue-800 font-semibold">อัตโนมัติในอีก</p>
                  <p className="text-blue-600">{countdown} วินาที</p>
                </div>
              </div>
            </div>

            {/* Available Calendar Features */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                ฟีเจอร์ปฏิทินที่ใช้งานได้
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="flex items-center text-green-800">
                  <span className="text-green-600 mr-2">📅</span>
                  ดูปฏิทินการจอง
                </div>
                <div className="flex items-center text-green-800">
                  <span className="text-green-600 mr-2">➕</span>
                  สร้างการจองใหม่
                </div>
                <div className="flex items-center text-green-800">
                  <span className="text-green-600 mr-2">✏️</span>
                  แก้ไขการจอง
                </div>
                <div className="flex items-center text-green-800">
                  <span className="text-green-600 mr-2">👁️</span>
                  ดูรายละเอียดการจอง
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGoCalendar}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto animate-slideInLeft"
            >
              <span className="mr-2">📅</span>
              ไปหน้าปฏิทินเลย
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm animate-slideInRight">
            <p className="flex items-center justify-center">
              <span className="mr-2">💡</span>
              ใช้เมนูด้านบนเพื่อนำทางไปยังส่วนต่างๆ ของระบบ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
