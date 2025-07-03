import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import ISO6391 from 'iso-639-1'
import { RowDataPacket } from "mysql2";
import { getLanguagesBySiteIdQuery } from "@/lib/db/queries/languages.query";

export async function POST(request: NextRequest, { params }: { params: { site_id: string } }) {
  try {
    const pool = await getPool();
    const { site_id } = await params;


    const [siteSupportedLanguagesRows] = await pool.query<RowDataPacket[]>(getLanguagesBySiteIdQuery, [site_id, site_id]);

    const allLanguages = ISO6391.getAllCodes()
    const result: Record<string, any> = {}

    siteSupportedLanguagesRows.forEach((row: any) => {
      if (allLanguages.includes(row.code)) {
        result[row.code] = {
          name: ISO6391.getNativeName(row.code),
          ...row,
        }
      }
    })
    console.log("reesss", result)
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
