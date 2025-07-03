import { NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function GET() {
  try {

    const pool = await getPool();
    const query = "SELECT * FROM string_catalog";
    const [rows] = await pool.query(query);

    return NextResponse.json(rows);
  } catch (error) {

    console.error("API HATASI:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
