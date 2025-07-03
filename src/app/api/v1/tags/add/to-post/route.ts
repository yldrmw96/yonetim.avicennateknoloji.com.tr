import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { title, slug, postId } = await request.json();
    const pool = await getPool();

    const addTagQuery = "INSERT INTO tags (title, slug) VALUES (?, ?)";
    const addTagPostMapQuery = "INSERT INTO tag_post_map (tag_id, post_id) VALUES (?, ?)";

    const [rows] = await pool.query<ResultSetHeader>(addTagQuery, [title, slug]);

    const tagId = rows.insertId;
    console.log(tagId);
    if (rows.affectedRows > 0) {
      if (postId !== undefined && postId !== null) {
        await pool.query(addTagPostMapQuery, [tagId, postId]);
        return NextResponse.json({ success: true, message: "Tag başarıyla eklendi", tagId: tagId });
      } else {
        return NextResponse.json({ success: true, message: "Tag başarıyla eklendi", tagId: tagId, postId: postId });
      }
    }
    return NextResponse.json({ success: false, message: "Tag eklenemedi", rows: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Tag eklenemedi", error: error });
  }
}