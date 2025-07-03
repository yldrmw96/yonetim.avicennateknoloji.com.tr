import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const pool = await getPool();
    const { siteId, cg_id } = await request.json();

    if (cg_id) {
      const [rows] = await pool.query(`
    WITH RECURSIVE kategori_agaci AS (
    -- Başlangıç noktası: id = 8 olan content_group
    SELECT cg.id, cg.parent_id, cg.slug, cg.label, 0 AS derinlik, cg.site_id
    FROM content_groups cg
    WHERE cg.id = ?  -- başlangıç noktası burası
      AND cg.site_id = ?

    UNION ALL

    -- Çocukları ve onların çocukları vs. alınır
    SELECT k.id, k.parent_id, k.slug, k.label, ka.derinlik + 1, k.site_id
    FROM content_groups k
    INNER JOIN kategori_agaci ka ON k.parent_id = ka.id
)
SELECT * FROM kategori_agaci
ORDER BY derinlik ASC;
      `, [cg_id, siteId]);
      return NextResponse.json(rows);
    } else {

      const [rows] = await pool.query(`
      WITH RECURSIVE kategori_agaci AS (
      SELECT cg.id, cg.parent_id, cg.slug, cg.label, 0 AS derinlik, cg.site_id
      FROM content_groups cg
      WHERE cg.parent_id IS NULL
      UNION ALL
      SELECT k.id, k.parent_id, k.slug, k.label, ka.derinlik + 1, ka.site_id
      FROM content_groups k
      INNER JOIN kategori_agaci ka ON k.parent_id = ka.id
      )
      SELECT * FROM kategori_agaci
      WHERE site_id = ?
      ORDER BY derinlik ASC;
      `, [siteId]);
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
