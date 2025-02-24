import { NextResponse } from "next/server";
import db from "@/db/db";
import { getServerSession } from "next-auth"; // ✅ Correct server-side session retrieval
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.topic || !data.start || !data.end || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query =
      "INSERT INTO user_reservation (user_id, user_res_topic, user_res_datetime_start, user_res_datetime_end, user_res_description) VALUES (?, ?, ?, ?, ?)";
    const values = [
      session.user.id,
      data.topic,
      data.start,
      data.end,
      data.description,
    ];

    await db.query(query, values);

    return NextResponse.json(
      { message: "Event added successfully", data },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error adding event:", e);
    return NextResponse.json({ error: "Error adding event" }, { status: 500 });
  }
}
