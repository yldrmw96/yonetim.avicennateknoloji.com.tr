import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId } = body;
    const pool = await getPool();
    const query = `
  select
  ff.field_name,
  ff.field_type,
  ff.is_required,
  fd.field_value
  from form_fields ff
  LEFT JOIN form_data fd
  ON fd.field_id = ff.id
  where ff.form_id = ${formId}
`
    const [data] = await pool.query(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}