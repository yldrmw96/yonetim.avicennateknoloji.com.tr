import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";
import { env } from "@/lib/env";
import { hashPassword } from "@/lib/utils/cyrpto";
import { Error, AuthenticationError } from "@/lib/error";

/**
 * Admin amaçlı şifre sıfırlama endpoint'i.
 * NOT: Bu endpoint'i production'da sadece admin kullanıcılarına açın.
 */
export async function POST(request: NextRequest) {

  const { userId, newPassword } = await request.json();
  
  // Giriş parametrelerini kontrol et
  const hasRequiredInfos = userId && newPassword;

  if (!hasRequiredInfos) AuthenticationError.MissingFields();

  try {
    const pool = await getPool();

    // Kullanıcının varlığını kontrol et
    const [userRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const userIsNotExist = !userRows || userRows.length === 0;
    if (userIsNotExist) AuthenticationError.NotFound();

    const hashedPassword = hashPassword(newPassword);

    // Şifreyi güncelle
    await pool.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, userId]
    );

    // Başarılı mı kontrol et
    const [updatedRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    return NextResponse.json({
      result_message: {
        code: "SUCCESS",
        message: "Kullanıcı şifresi başarıyla sıfırlandı",
        status: "success",
      },
    });
  } catch (error) {
    return AuthenticationError.PasswordResetError();
  }
} 