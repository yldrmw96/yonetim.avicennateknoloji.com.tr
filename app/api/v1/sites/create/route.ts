import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
 try {
   const {
     name,
     defaultLangId,
     ownerId
   } = await request.json();

   const pool = await getPool();
   const [rows] = await pool.query("INSERT INTO sites (name, default_lang_id, owner_id) VALUES (?, ?, ?)", [name, defaultLangId, ownerId]);
   
   return NextResponse.json(rows);
 } catch (error) {
  return NextResponse.json({ error: error }, { status: 500 });
 }
}