import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { group_id: string } }) {
  try {
    const { group_id } = await params;
    const pool = await getPool();
    const requestData = await request.json();
    const { group_id: new_group_id } = requestData;
    const query = "UPDATE string_catalog SET group_id = ? WHERE group_id = ?";
    const [rows] = await pool.query(query, [new_group_id, group_id]);
    return NextResponse.json(rows);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}