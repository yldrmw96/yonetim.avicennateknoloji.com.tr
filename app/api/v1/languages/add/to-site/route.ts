import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { addLanguageToSiteQuery } from "@/lib/db/queries/languages.query";

export async function POST(request: NextRequest) {
  const { lang_id, site_id } = await request.json();
  if (!lang_id || !site_id) {
    return NextResponse.json({ error: "Lang ID and site ID are required" }, { status: 400 });
  }
  const pool = await getPool();
  const [rows] = await pool.query(addLanguageToSiteQuery, [lang_id, site_id]);
  // console.log(rows);
  return NextResponse.json(rows);
}