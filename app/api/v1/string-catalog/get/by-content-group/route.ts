import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const { site_id, cg_id } = await request.json();
    const pool = await getPool();
    const [rows] = await pool.query(`SELECT 
    sk.id as key_id, 
    sk.key,
    sc.id as string_id,
    sc.lang_code,
    sc.content 
    FROM string_keys sk 
    LEFT JOIN string_catalog sc 
    ON sc.key_id = sk.id
    WHERE sk.site_id = ? 
    AND sc.group_id = ?;`, [site_id, cg_id]);

    // console.log("rows", rows)
    // console.log("site_id", site_id)
    // console.log("cg_id", cg_id)
    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 