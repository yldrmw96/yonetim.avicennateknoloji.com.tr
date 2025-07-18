import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { key_id: string } }) {
  try {
    const { key_id } = await params;
    const pool = await getPool();
    const requestData = await request.json();
    const { key } = requestData;
    const query = "UPDATE string_keys SET \`key\` = ? WHERE id = ?";
    const [rows] = await pool.query(query, [key, key_id]);
    // console.log(rows);
    return NextResponse.json(rows); 
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}