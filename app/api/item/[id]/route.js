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
      "SELECT user_reservation.user_reserve_id, user_reservation.user_id, user_reservation.user_res_topic, user_reservation.user_res_description, user_reservation.user_res_datetime_start, user_reservation.user_res_datetime_end, users.title, users.firstname, users.lastname FROM user_reservation INNER JOIN users ON user_reservation.user_id = users.user_id WHERE user_reserve_id = ?",
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
