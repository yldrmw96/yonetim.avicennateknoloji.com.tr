import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { addSupportedLanguageQuery } from "@/lib/db/queries/languages.query";

export async function POST(request: NextRequest) {
  const { code, name } = await request.json();
  const pool = await getPool();
  const [rows] = await pool.query(addSupportedLanguageQuery, [code, name]);
  return NextResponse.json(rows);
}