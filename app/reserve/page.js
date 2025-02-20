"use client";
import TableReserve from "../components/TableReserve";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
      <div className="flex justify-center items-center h-screen">
        <div className="text-center"> 
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <section className="py-5">
        <div className="container">
          <h1 className="text-3xl font-bold">การจองของฉัน</h1>
          <TableReserve />
        </div>
      </section>
    </>
    
  )
}