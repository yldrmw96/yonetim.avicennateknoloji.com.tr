import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const { siteId } = await request.json();

    const query = `
SELECT
  (SELECT COUNT(*)
   FROM form_submissions
   WHERE status = 'new' AND site_id = ?) AS number_of_unread_messages,

  (SELECT COUNT(*)
   FROM users u
   RIGHT JOIN ownership o ON u.id = o.user_id
   WHERE o.site_id = ?) AS number_of_users
  `;

    const pool = await getPool();
    const [rows] = await pool.query(query, [siteId, siteId]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}