"use client";
import TableReserve from "../components/TableReserve";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Myreserve() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    
  }, [router, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex justify-center items-center pt-16">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          <p className="text-sm text-gray-400 mt-2">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📋</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">การจองของฉัน</h1>
                <p className="text-gray-600 text-sm">จัดการและดูรายการจองห้องประชุมของคุณ</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/calendar")}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="hidden sm:inline">กลับไปปฏิทิน</span>
              <span className="sm:hidden">📅</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6">
            <TableReserve />
          </div>
        </div>
      </div>
    </div>
  );
}