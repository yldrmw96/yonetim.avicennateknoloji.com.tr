import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  const { content_id, data } = await request.json();

  const pool = await getPool();
  const query = "UPDATE string_catalog SET content = ? WHERE id = ?";
  const [rows] = await pool.query(query, [data, content_id]);
  return NextResponse.json(rows);
}