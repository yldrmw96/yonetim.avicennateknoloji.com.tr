import { NextRequest, NextResponse } from 'next/server';
import { getPool } from "@/lib/connection_parameters";

import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // FormData olarak dosyayı al
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosyanın bayt verilerini al
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kaydetme yolu
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Klasörü oluştur (eğer yoksa)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Dosyayı kaydet
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const pool = await getPool();
    const [rows] = await pool.query("INSERT INTO files (path,file_name, group_id) VALUES (?, ?, ?)", [`uploads/${file.name}`, file.name, 1]);

    return NextResponse.json({
      message: 'Dosya başarıyla yüklendi',
      path: `/uploads/${file.name}`,
      result: rows
    }, { status: 200 });

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json({
      message: 'Dosya yüklenirken hata oluştu'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id, name } = await req.json();
  const pool = await getPool();
  await pool.query("DELETE FROM files WHERE id = ?", [id]);
  const filePath = path.join(process.cwd(), 'public', 'uploads', name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return NextResponse.json({ message: 'Dosya başarıyla silindi' }, { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 