import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { siteId } = await request.json();
    const pool = await getPool();
    
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.first_name,
       u.family_name,
       u.email, 
       u.id 
       from ownership o
       LEFT JOIN users u 
       ON o.user_id = u.id
       WHERE o.site_id = ?
    `, [siteId]
    );

    return NextResponse.json(rows);
  }
  catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 