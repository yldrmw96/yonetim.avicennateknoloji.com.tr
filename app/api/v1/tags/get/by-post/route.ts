import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  const { postId } = await request.json();
  const pool = await getPool();
  const [rows] = await pool.query(`
    SELECT t.* FROM tags t
    LEFT JOIN tag_post_map tpm ON t.id = tpm.tag_id
    WHERE tpm.post_id = ?`,
    [postId]);
  return NextResponse.json(rows);
}