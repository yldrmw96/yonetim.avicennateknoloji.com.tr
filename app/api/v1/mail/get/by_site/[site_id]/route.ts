import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/connection_parameters";
import { getMailPropertiesBySiteIdQuery } from "@/lib/db/queries/properties.query";

export async function POST(request: NextRequest, { params }: { params: Promise<{ site_id: string }> }) {
  const { site_id } = await params;

  if (!site_id) {
    return NextResponse.json(
      { error: "slug parametresi gereklidir" },
      { status: 400 }
    );
  }
  try {
    const pool = await getPool();
    const [mailConfigurationsResult] = await pool.query<RowDataPacket[]>(
      getMailPropertiesBySiteIdQuery,
      [site_id]
    );

    // Sonuçları formatla
    const smtpSettings = mailConfigurationsResult.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {
      smtp_host: '',
      smtp_port: '',
      smtp_username: '',
      smtp_password: ''
    });
    return NextResponse.json({
      smtpHost: smtpSettings.smtp_host,
      smtpPort: smtpSettings.smtp_port,
      smtpUsername: smtpSettings.smtp_username,
      smtpPassword: smtpSettings.smtp_password
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Veri alınırken hata oluştu: " + error.message },
      { status: 500 }
    );
  }
}