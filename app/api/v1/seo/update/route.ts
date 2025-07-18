import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

const SEO_KEYS = {
  TITLE: 'meta_title',
  DESCRIPTION: 'meta_description',
  KEYWORDS: 'meta_keywords',
  AUTHOR: 'meta_author'
};

export async function POST(request: NextRequest) {
  const pool = await getPool();
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaAuthor,
    siteId
  } = await request.json();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingProperties] = await connection.query(
      `SELECT pl.id, pl.\`key\` 
       FROM property_map pm
       JOIN property_list pl ON pm.property_id = pl.id
       WHERE pm.property_group_id = 1 AND pm.site_id = ?`,
      [siteId]
    );

    const existingPropsMap = new Map(
      existingProperties.map((p: any) => [p.key, p.id])
    );

    await updateOrCreateProperty(
      connection,
      existingPropsMap,
      SEO_KEYS.TITLE,
      metaTitle,
      siteId
    );

    await updateOrCreateProperty(
      connection,
      existingPropsMap,
      SEO_KEYS.DESCRIPTION,
      metaDescription,
      siteId
    );

    await updateOrCreateProperty(
      connection,
      existingPropsMap,
      SEO_KEYS.KEYWORDS,
      metaKeywords,
      siteId
    );

    await updateOrCreateProperty(
      connection,
      existingPropsMap,
      SEO_KEYS.AUTHOR,
      metaAuthor,
      siteId
    );

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

async function updateOrCreateProperty(
  connection: any,
  existingPropsMap: Map<string, number>,
  key: string,
  value: string | number,
  siteId: number
) {
  if (existingPropsMap.has(key)) {
    const propId = existingPropsMap.get(key)!;
    await connection.query(
      `UPDATE property_list SET value = ? WHERE id = ?`,
      [value, propId]
    );
  } else {
    const [insertResult] = await connection.query(
      // key kelimesini ters tırnak içinde kullan
      `INSERT INTO property_list (\`key\`, value) VALUES (?, ?)`,
      [key, value]
    );

    const newPropId = insertResult.insertId;

    await connection.query(
      `INSERT INTO property_map 
      (property_group_id, property_id, site_id) 
      VALUES (2, ?, ?)`,
      [newPropId, siteId]
    );
  }
}