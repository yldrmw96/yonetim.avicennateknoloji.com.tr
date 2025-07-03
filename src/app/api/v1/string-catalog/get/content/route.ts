import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/utils/cyrpto";

export async function POST(request: NextRequest) {
  try {
    const { site_id, lang_code } = await request.json();

    const pool = await getPool();

    const query = `
  SELECT
    cg.id as group_id,
    cg.slug as group_name,
    cg.label as group_label,
    cg.site_id as site_id,
    sc.id as content_id,
    sc.content as content,
    sc.lang_code as lang_code,
    sc.key_id as key_id
    FROM string_catalog sc
    left join content_groups cg
    on sc.group_id = cg.id
    where cg.site_id = ?
    and sc.lang_code = ?`;

    const [rows] = await pool.query(query, [site_id, lang_code]);
    return NextResponse.json(rows);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}