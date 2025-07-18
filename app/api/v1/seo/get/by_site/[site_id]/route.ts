import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { getSeoPropertiesBySiteIdQuery } from "@/lib/db/queries/properties.query";

export async function POST(request: NextRequest, { params }: { params: Promise<{ site_id: string }> }) {
  const { site_id } = await params;

  if (!site_id) {
    return NextResponse.json(
      { error: "slug parametresi gereklidir" },
      { status: 400 }
    );
  }

  const pool = await getPool();

  try {


    // SEO ayarlarını getir
    const [settingsResult] = await pool.query(
      getSeoPropertiesBySiteIdQuery,
      [site_id]
    );

    // Sonuçları formatla
    const smtpSettings = settingsResult.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      meta_author: ''
    });

    return NextResponse.json({
      metaTitle: smtpSettings.meta_title,
      metaDescription: smtpSettings.meta_description,
      metaKeywords: smtpSettings.meta_keywords,
      metaAuthor: smtpSettings.meta_author
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Veri alınırken hata oluştu: " + error.message },
      { status: 500 }
    );
  }
}