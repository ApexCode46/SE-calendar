import { NextResponse } from "next/server";
import db from "@/db/db";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    if (
      !body.topic ||
      !body.description ||
      !body.startDateTime ||
      !body.endDateTime
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE user_reservation
       SET user_res_topic = ?,
           user_res_description = ?,
           user_res_datetime_start = ?,
           user_res_datetime_end = ?
       WHERE user_reserve_id = ?`,
      [
        body.topic,
        body.description,
        body.startDateTime,
        body.endDateTime,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `DELETE FROM user_reservation WHERE user_reserve_id = ?`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Delete successful" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
