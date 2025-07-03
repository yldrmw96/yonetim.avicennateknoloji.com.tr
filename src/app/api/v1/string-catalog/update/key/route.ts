import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  const { key_id, data } = await request.json();

  const pool = await getPool();
  const query = "UPDATE string_keys SET \`key`\ = ? WHERE id = ?";
  const [rows] = await pool.query(query, [data, key_id]);
  return NextResponse.json(rows);
}