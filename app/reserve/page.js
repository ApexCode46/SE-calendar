"use client";
import TableReserve from "../components/TableReserve";

export default function Myreserve() {

  
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