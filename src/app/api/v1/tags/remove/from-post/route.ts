import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { tagId, postId } = await request.json();
    console.log(tagId, postId);
    const pool = await getPool();
    const [rows] = await pool.query<ResultSetHeader>(`
      DELETE FROM tag_post_map 
      WHERE tag_id = ? 
      AND post_id = ?
    `, [tagId, postId]);
    
    if (rows.affectedRows > 0) {
      return NextResponse.json({ success: true, message: "Tag başarıyla silindi" });
    }
    return NextResponse.json({ success: false, message: "Tag silinemedi", rows: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Tag silinemedi", error: error });
  }
}