import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { ResultSetHeader } from "mysql2";
import { nanoid } from "nanoid";
import slugify from "react-slugify";

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, slug, slug_uid, content, created_at, updated_at, ownership_id, published_at } = await request.json();
    const pool = await getPool();

    // Tarihleri MySQL formatına dönüştür
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const [rows] = await pool.query<ResultSetHeader>(`INSERT INTO posts (title, lang_id, excerpt, status, slug, slug_uid, ownership_id, content, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)`,
      [
        title ?? "",
        1,
        excerpt ?? "",
        "published",
        slug ?? slugify(title),
        slug_uid ?? nanoid().toLowerCase(),
        ownership_id ?? 1,
        content ?? "",
        formatDate(created_at ?? new Date().toISOString()),
        formatDate(updated_at ?? new Date().toISOString()),
        formatDate(published_at ?? new Date().toISOString()),
      ]);
    if (rows.affectedRows > 0) {
      return NextResponse.json({ success: true, message: "Blog yazısı başarıyla eklendi", postId: rows.insertId });
    } else {
      throw new Error("Blog yazısı eklenemedi");
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Blog yazısı eklenemedi", error: error });
  }
} 