import { NextResponse } from "next/server";
import db from "@/db/db";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" }, 
        { status: 401 }
      );
    }

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

    if (!data.topic || !data.start || !data.end) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    let checkTime = false;
    
    const queryCheckTime = "SELECT COUNT(*) FROM user_reservation WHERE user_res_datetime_start < ? AND user_res_datetime_end > ?";
    const values = [data.end, data.start];
    const [rows] = await db.query(queryCheckTime, values);

    const overlapCount = rows[0]['COUNT(*)'];
    
    if(overlapCount == 0){
      checkTime = true;
    }

    if(checkTime){
      const queryCreate =
      "INSERT INTO user_reservation (user_id, user_res_topic, user_res_datetime_start, user_res_datetime_end, user_res_description) VALUES (?, ?, ?, ?, ?)";
      const values = [
        session.user.id,
        data.topic,
        data.start,
        data.end,
        data.description,
      ];

      await db.query(queryCreate, values);
       return NextResponse.json(
      { message: "Event added successfully", data },
      { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "มีการทับซ้อนเวลา ของการจองห้อง กรุณาเปลี่ยนเวลา!"},
      { status: 409 }
    );
  } catch (e) {
    console.error("Error adding event:", e);
    return NextResponse.json({ error: "Error adding event" }, { status: 500 });
  }
}
