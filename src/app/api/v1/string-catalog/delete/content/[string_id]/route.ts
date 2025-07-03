import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { string_id: string } }) {
  const { string_id } = await params;
  const pool = await getPool();
  const query = "DELETE FROM string_catalog WHERE id = ?";
  const [rows] = await pool.query(query, [string_id]);
  return NextResponse.json(rows);
}