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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1">ชื่อผู้ใช้</label>
        <input 
          id="username"
          type="text" 
          placeholder="กรอกชื่อผู้ใช้" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block mb-1">รหัสผ่าน</label>
        <input 
          id="password"
          type="password" 
          placeholder="กรอกรหัสผ่าน" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-red-800 text-yellow-300 p-2 rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}