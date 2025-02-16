"use client"
import { useRouter } from 'next/navigation';
export default function Nav() {
  const router = useRouter();
  return (
    <div className="flex fixed z-50 w-full h-12  items-center justify-start bg-red-800">
      <p className=" pl-4 text-yellow-300 text-xl font-bold" onClick={() => router.push('/calendar')}>SE Calendar</p>
    </div>
  )
} 