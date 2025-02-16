import { NextResponse } from "next/server";
import db from "@/db/db";

export async function GET() {
  try {
    const [results] = await db.query("SELECT * FROM user_reservation");
    return NextResponse.json(results, { status: 200 });

  } catch (e) {
    console.error("Error fetching events:", e.message);
    return NextResponse.json(
      { error: "Error fetching events", details: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log(data);

    if (!data.topic || !data.start || !data.end || !data.description) {
      return NextResponse.json(
        { error: "Misssing required fields" },
        { status: 400 }
      );
    }

    const query =
      "INSERT INTO user_reservation (user_id, user_res_topic, user_res_datetime_start, user_res_datetime_end, user_res_description) VALUES (?, ?, ?, ?, ?)";
    const values = [6510014111, data.topic, data.start, data.end, data.description];
    await db.query(query, values);
     
    return NextResponse.json(
      { meesage: "Event added successfully ", data},
      { status: 201 }
    );
  } catch (e) {
    console.error("Error adding event:", e);
    return NextResponse.json({ error: "Error adding event" }, { status: 500 });
  }
}
