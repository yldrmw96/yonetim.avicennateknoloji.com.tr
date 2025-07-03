
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { getPool } from "@/lib/connection_parameters";
import { v4 as uuidv4 } from 'uuid';


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

    const resizedId = uuidv4();

    const resizedFile = await sharp(buffer)
      .jpeg({ quality: 70 })
      .toFile(path.join(process.cwd(), 'public', 'uploads', 'images', 'resized', resizedId + '.jpg'));


    const thumbnailId = uuidv4();

    const thumbnailFile = await sharp(buffer)
      .resize(48, 48)
      .toFile(path.join(process.cwd(), 'public', 'uploads', 'images', 'thumbnail', thumbnailId + '.jpg'));

    // Kaydetme yolu 
    // TODO: Change absolute path to relative path bcause may be we want upload to other server or cdn or etc.
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Klasörü oluştur (eğer yoksa)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Dosyayı kaydet
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const pool = await getPool();
    const [rows] = await pool.query("INSERT INTO files (path, file_name,thumbnail_id, resized_id, file_extension, group_id) VALUES (?, ?, ?, ?, ?, ?)", [`uploads/${file.name}`, "", thumbnailId, resizedId, file.name.split('.').pop() ?? "", 1]);

    return NextResponse.json({
      message: 'Dosya başarıyla yüklendi',
      path: `/uploads/${file.name}`,
      thumbnail: `/uploads/images/thumbnails/${thumbnailId}.jpg`,
      resized: `/uploads/images/resized/${resizedId}.jpg`,
      result: rows
    }, { status: 200 });

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json({
      message: 'Dosya yüklenirken hata oluştu'
    }, { status: 500 });
  }
}
