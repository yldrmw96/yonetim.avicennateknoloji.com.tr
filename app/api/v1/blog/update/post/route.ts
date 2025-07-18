import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { postId, content, title, meta_title, slug, slug_uid, excerpt, ownership_id, updated_at } = await request.json();
    const pool = await getPool();

    // Güncellenecek alanları ve değerlerini belirle
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (meta_title !== undefined) {
      updateFields.push('meta_title = ?');
      updateValues.push(meta_title);
    }
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (slug_uid !== undefined) {
      updateFields.push('slug_uid = ?');
      updateValues.push(slug_uid);
    }
    if (excerpt !== undefined) {
      updateFields.push('excerpt = ?');
      updateValues.push(excerpt);
    }
    if (ownership_id !== undefined) {
      updateFields.push('ownership_id = ?');
      updateValues.push(ownership_id);
    }
    if (updated_at !== undefined) {
      updateFields.push('updated_at = ?');
      // Timestamp formatını düzenle
      const date = new Date(updated_at);
      const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
      updateValues.push(formattedDate);
    }

    // Eğer güncellenecek alan yoksa hata döndür
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'Güncellenecek alan bulunamadı' }, { status: 400 });
    }

    // SQL sorgusunu oluştur
    const query = `UPDATE posts SET ${updateFields.join(', ')} WHERE id = ?`;
    updateValues.push(postId);

    const [rows] = await pool.query<RowDataPacket[]>(query, updateValues);

    return NextResponse.json({ success: true, message: 'Blog yazısı başarıyla güncellendi', rows: rows });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}