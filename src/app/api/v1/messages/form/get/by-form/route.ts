import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, siteId } = body;
    const pool = await getPool();
    const query = `CALL GetFormSubmissionsBySiteAndFormId(?,?)`;
    const [data] = await pool.execute(query, [siteId, formId]);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({
      error: "Internal server error",
      message: err.message
    }, {
      status: 500
    });
  }
}




