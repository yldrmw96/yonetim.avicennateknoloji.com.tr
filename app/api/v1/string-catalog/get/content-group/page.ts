import { getPool } from "@/lib/utils/cyrpto";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { site_id, lang_code } = await request.json();

  const pool = await getPool();

  const query = `
  SELECT * FROM content_groups WHERE site_id = ? AND lang_code = ?`;

  const [rows] = await pool.query(query, [site_id, lang_code]);
  return NextResponse.json(rows);
} 