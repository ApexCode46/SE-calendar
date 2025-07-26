"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
  
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/calendar"); 
      }
    } catch(error) { 
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-yellow-300 text-3xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-red-800 mb-2">SE Calendar</h1>
          <p className="text-gray-600">ระบบจองห้องประชุม</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <input 
                  id="username"
                  type="text" 
                  placeholder="กรอกชื่อผู้ใช้" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 pl-10" 
                  required 
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input 
                  id="password"
                  type="password" 
                  placeholder="กรอกรหัสผ่าน" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 pl-10" 
                  required 
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-8 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังเข้าสู่ระบบ...
              </div>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 SE Calendar - ระบบจองห้องสาขา</p>
        </div>
      </div>
    </div>
  );
}