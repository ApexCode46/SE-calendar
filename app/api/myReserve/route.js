import { NextResponse } from "next/server";
import db from "@/db/db";

export async function GET() {
  try {
    const [results] = await db.query(
      "SELECT * FROM user_reservation WHERE user_id = ?",
      [6510014111]
    );
    return NextResponse.json(results, { status: 200 });
  } catch (e) {
    console.error("Error fetching events:", e.message);
    return NextResponse.json(
      { error: "Error fetching events", details: e.message },
      { status: 500 }
    );
  }
}
