import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest, { params }: { params: { site_id: string } }) {
  try {
    const { lang_code } = await request.json();
    // console.log(lang_code);
    
    if (!lang_code) {
      return NextResponse.json({ error: "Lang code is required" }, { status: 400 });
    }
    const { site_id } = await params;
    if (!site_id) {
      return NextResponse.json({ error: "Site id is required" }, { status: 400 });
    }

    const pool = await getPool();
    const query = `
    SELECT 
    sk.id as key_id,
    sc.id as content_id, 
    sc.content as content, 
    sc.lang_code as lang_code, 
    cg.id as group_id, 
    cg.name as group_name, 
    cg.label as group_label, 
    cg.site_id as site_id, 
    sk.key as \`key\` FROM string_keys sk
    left join string_catalog sc 
    on sk.id = sc.key_id
    left join content_groups cg 
    on sc.group_id = cg.id
    where cg.site_id = ? 
    and sc.lang_code = ?`;

    const [rows] = await pool.query(query, [site_id, lang_code]);
    return NextResponse.json(rows);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 