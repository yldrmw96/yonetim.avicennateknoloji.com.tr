import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  const { lang_code, group_id, key_id, data } = await request.json();
  
  const pool = await getPool();
  const query = "INSERT INTO string_catalog (lang_code, group_id, key_id, content) VALUES (?, ?, ?, ?)";
  const [rows] = await pool.query(query, [lang_code, group_id, key_id, data]);
  return NextResponse.json(rows);
}