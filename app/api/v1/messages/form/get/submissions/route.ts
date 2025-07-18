import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId } = body;
    const pool = await getPool();
    const query = `
    SELECT 
    f.id as form_id,
    f.name,
    f.recipient_email,
    f.created_at,
    fs.id as submission_id,
    fs.created_at as submission_created_at
    FROM forms f
    left join form_submissions fs
    on fs.form_id = f.id
    WHERE f.site_id= ${siteId}
  `
    const [data] = await pool.query(query);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ 
      error: "Internal server error" ,
      message: err.message
    }, {
       status: 500 
      });
  }
}




