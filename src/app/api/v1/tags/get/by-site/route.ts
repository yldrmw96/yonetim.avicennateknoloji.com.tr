import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  const { siteId } = await request.json();
  const pool = await getPool();
  const [rows] = await pool.query<ResultSetHeader[]>(`
    SELECT t.* FROM ownership o
    INNER JOIN posts p ON p.ownership_id = o.id
    INNER JOIN tag_post_map tpm ON tpm.post_id = p.id
    INNER JOIN tags t ON t.id = tpm.tag_id
    WHERE o.site_id = ?`,
    [siteId]);
  return NextResponse.json(rows);
}