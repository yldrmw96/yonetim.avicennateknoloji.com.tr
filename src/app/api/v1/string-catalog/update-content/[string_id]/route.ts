import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { string_id: string } }) {
 try {
   const { string_id } = await params;
   const pool = await getPool();
   const requestData = await request.json();
   const { content } = requestData;
   const query = "UPDATE string_catalog SET content = ? WHERE id = ?";
   const [rows] = await pool.query(query, [content, string_id]);
   return NextResponse.json(rows);
 } catch (error) {
  console.error(error);
  return NextResponse.json({ error: error }, { status: 500 });
 }
}