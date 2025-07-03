import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  const { data, site_id } = await request.json();

  const pool = await getPool();
  const query = "INSERT INTO string_keys (\`key\`, site_id) VALUES (?, ?)";
  const [rows] = await pool.query(query, [data, site_id]);
  return NextResponse.json(rows);
}