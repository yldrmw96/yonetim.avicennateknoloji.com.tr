import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const { cg_id, site_id } = await request.json();
    const pool = await getPool();
    
    if (cg_id && site_id) {
      const [rows] = await pool.query(`SELECT 
        cg.id as group_id,
        f.id as file_id,
        f.file_name,
        f.resized_id,
        f.thumbnail_id,
        f.group_id,
        f.file_extension
      FROM content_groups cg 
      INNER JOIN files f ON f.group_id = cg.id
      WHERE cg.id = ? AND cg.site_id = ?`, [cg_id, site_id]);
      return NextResponse.json(rows);
    }

    if (site_id && (cg_id === null || cg_id === undefined)) {
      const [rows] = await pool.query(`SELECT 
        cg.id as group_id,
        cg.site_id,
        f.id as file_id,
        f.file_name,
        f.resized_id,
        f.thumbnail_id,
        f.group_id,
        f.file_extension
      FROM content_groups cg 
      INNER JOIN files f ON f.group_id = cg.id
      WHERE cg.site_id = ?`, [site_id]);
      return NextResponse.json(rows);
    }

    return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 