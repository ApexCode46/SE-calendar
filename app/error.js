"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/calendar");
  };

  const handleRetry = () => {
    reset();
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 pt-16">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-2xl w-full text-center">
          {/* Error Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <span className="text-6xl text-white">🚫</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping">
                <span className="text-white text-sm">!</span>
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              เกิดข้อผิดพลาดในการโหลดหน้า
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              ขออภัย ไม่สามารถโหลดหน้านี้ได้ในขณะนี้
              <br className="hidden sm:block" />
              กรุณาลองใหม่อีกครั้งหรือกลับไปหน้าหลัก
            </p>

            {/* Error Type Indicator */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200">
              <div className="flex items-center justify-center space-x-2 text-amber-800">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">
                  ปัญหาการเชื่อมต่อหรือการโหลดข้อมูล
                </span>
              </div>
            </div>

            {/* Action Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                วิธีแก้ไขที่แนะนำ
              </h3>
              <ul className="text-left text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  ลองรีเฟรชหน้าหรือคลิก "ลองใหม่"
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  กลับไปหน้าปฏิทินและลองใหม่
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <span className="mr-2">🔄</span>
                ลองใหม่
              </button>
              
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

          {/* Debug Info (Development only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-gray-100 rounded-xl p-4 mb-8 text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Information:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {error.message}
              </pre>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p className="flex items-center justify-center">
              <span className="mr-2">🛠️</span>
              หากปัญหายังคงอยู่ กรุณารายงานให้ผู้ดูแลระบบทราบ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
