import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";
import { hashPassword } from "@/lib/utils/cyrpto";
// Sabit şifreleme anahtarı - Diğer API'lerle aynı olmalı


/**
 * Admin amaçlı şifre sıfırlama endpoint'i.
 * NOT: Bu endpoint'i production'da sadece admin kullanıcılarına açın.
 */
export async function POST(request: NextRequest) {
  // const { userId, newPassword } = await request.json();
  const userId = 1;
  const newPassword = "12345678";
  
  // Giriş parametrelerini kontrol et
  if (!userId || !newPassword) {
    return NextResponse.json({
      result_message: {
        code: "MISSING_FIELDS",
        message: "Kullanıcı ID ve yeni şifre gereklidir",
        status: "error",
      }
    }, { status: 400 });
  }
  
  try {
    const pool = await getPool();
    
    // Kullanıcının varlığını kontrol et
    const [userRows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [userId]);
    
    if (!userRows || userRows.length === 0) {
      return NextResponse.json({
        result_message: {
          code: "USER_NOT_FOUND",
          message: "Kullanıcı bulunamadı",
          status: "error",
        }
      }, { status: 404 });
    }
    
    // Yeni şifreyi hashle
    const hashedPassword = hashPassword(newPassword);
    
    // console.log("[ŞifreSıfırlama] Kullanıcı ID:", userId);
    // console.log("[ŞifreSıfırlama] Yeni şifre:", newPassword);
    // console.log("[ŞifreSıfırlama] Yeni hash:", hashedPassword);
    
    // Şifreyi güncelle
    await pool.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, userId]
    );
    
    // Başarılı mı kontrol et
    const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [userId]);
    const updatedUser = updatedRows[0];
    
    // console.log("[ŞifreSıfırlama] Güncelleme sonrası DB'deki hash:", updatedUser.password);
    // console.log("[ŞifreSıfırlama] Hash'ler eşleşiyor mu:", hashedPassword === updatedUser.password);
    
    return NextResponse.json({
      result_message: {
        code: "SUCCESS",
        message: "Kullanıcı şifresi başarıyla sıfırlandı",
        status: "success",
      }
    });
  } catch (error) {
    // console.error("[ŞifreSıfırlama] Hata:", error);
    return NextResponse.json({
      result_message: {
        code: "ERROR",
        message: "Şifre sıfırlanırken bir hata oluştu",
        status: "error",
      }
    }, { status: 500 });
  }
} 