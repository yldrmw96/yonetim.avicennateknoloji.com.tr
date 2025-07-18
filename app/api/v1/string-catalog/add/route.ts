import { getPool } from "@/lib/utils/cyrpto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { key, content, lang_code, group_id } = await request.json();
    // console.log("data",key, content, lang_code, group_id);
    if (key === null) {
      return NextResponse.json({ error: "Key is required" },  { status: 400 });
    }
    if (content === null) {
      return NextResponse.json({ error: "Content is required" },  { status: 400 });
    } 
    if (lang_code === null) {
      return NextResponse.json({ error: "Lang code is required" },  { status: 400 });
    }
    if (group_id === null) {
      return NextResponse.json({ error: "Group id is required" },  { status: 400 });
    }
    const pool = await getPool();
    const results: any[] = [];
    let lastInsertedId = null;
    if (key) {
      const query = `
        INSERT INTO string_keys (\`key\`) 
        VALUES (?) 
        ON DUPLICATE KEY UPDATE \`key\` = VALUES(\`key\`)
      `;

      const [rows]: any = await pool.query(query, [key]);

      results.push(rows);

      // insertId sadece yeni kayıt eklendiğinde anlamlıdır
      lastInsertedId = rows.insertId && rows.insertId !== 0 ? rows.insertId : null;
      // console.log("lastInsertedId", lastInsertedId);

    } else {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }


    if (content && lastInsertedId) {  
       const query = "INSERT INTO string_catalog (lang_code, group_id, key_id, content) VALUES (?, ?, ?, ?)";
       const [rows] = await pool.query(query, [lang_code, group_id, lastInsertedId, content]);
       results.push(rows);
    } else {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    return NextResponse.json(results);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Key and content are required" }, { status: 400 });
  }
}