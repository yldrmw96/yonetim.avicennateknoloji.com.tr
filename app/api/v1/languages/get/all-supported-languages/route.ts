import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import ISO6391 from 'iso-639-1'
import { RowDataPacket } from "mysql2";
import { getAllLanguagesQuery } from "@/lib/db/queries/languages.query";

export async function GET(request: NextRequest) {
  try {
    const pool = await getPool();
    const [rows] = await pool.query<RowDataPacket[]>(getAllLanguagesQuery);

    const allLanguages = ISO6391.getAllCodes()
    const result: Record<string, any> = {}

    rows.forEach((row: any) => {
      if (allLanguages.includes(row.code)) {
        result[row.code] = {
          id: row.id,
          code: row.code,
          name: ISO6391.getNativeName(row.code)
        }
      }
    })

    return NextResponse.json(result);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 