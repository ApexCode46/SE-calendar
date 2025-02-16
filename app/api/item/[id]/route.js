import { NextResponse } from "next/server";
import db from "@/db/db";

export async function GET(req, {params} ) {
  try {
    const { id } =  await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const [results] = await db.query(
      "SELECT * FROM user_reservation WHERE user_reserve_id = ?",
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0], { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error fetching event", details: e.message },
      { status: 500 }
    );
  }
}
