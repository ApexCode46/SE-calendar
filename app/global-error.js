"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log error to monitoring service
    console.error("Global error:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/calendar");
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-6xl text-white">💥</span>
              </div>
            </div>

            {/* Error Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                เกิดข้อผิดพลาดในระบบ
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น
                <br />
                กรุณาลองใหม่อีกครั้งหรือกลับไปหน้าหลัก
              </p>

              {/* Error Details (Development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">รายละเอียดข้อผิดพลาด (Development):</h3>
                  <code className="text-xs text-red-700 break-all">
                    {error?.message || 'Unknown error'}
                  </code>
                </div>
              )}

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
                  <span className="mr-2">🏠</span>
                  กลับหน้าหลัก
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm">
              <p className="flex items-center justify-center">
                <span className="mr-2">📅</span>
                SE Calendar - หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
