import { getPool } from "@/lib/utils/cyrpto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { site_id } = await request.json();

  const pool = await getPool();

  const query = `
  SELECT 
  id as key_id,
  \`key\`
  FROM string_keys
  WHERE site_id = ?`;
  
  const [rows] = await pool.query(query, [site_id]);
  // console.log(rows);
  return NextResponse.json(rows);
}