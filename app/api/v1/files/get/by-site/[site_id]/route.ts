import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { site_id: string } }) {
  try {
    const pool = await getPool();
  const { site_id } = await params;
  const [rows] = await pool.query("SELECT f.id, f.file_name as name ,f.path, f.thumbnail_id, f.resized_id, f.file_extension FROM files f left join content_groups cg on f.group_id = cg.id where cg.site_id = ?", [site_id]);
  return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
