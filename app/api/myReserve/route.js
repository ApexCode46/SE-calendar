import { NextResponse } from "next/server";
import db from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const [results] = await db.query(
      "SELECT * FROM user_reservation WHERE user_id = ?",
      [userId]
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
