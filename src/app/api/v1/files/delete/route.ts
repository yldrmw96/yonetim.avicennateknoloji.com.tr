import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import path from "path";
import fs from "fs";

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