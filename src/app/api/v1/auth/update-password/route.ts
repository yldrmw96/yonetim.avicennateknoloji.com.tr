
import {
  hashPassword,
  isPasswordComplex,
  comparePassword,
  NextRequest,
  NextResponse,
  RowDataPacket,
  getPool,
} from "@/lib/utils/cyrpto";

export async function POST(request: NextRequest) {
  const { id, password, currentPassword } = await request.json();
  
  // Gerekli alanların kontrolü
  if (!id || !password) {
    return NextResponse.json({
      result_message: {
        code: "MISSING_FIELDS",
        message: "Kullanıcı ID ve yeni şifre alanları zorunludur",
        status: "error",
      }
    }, { status: 400 });
  }
  
  // Şifre karmaşıklık kontrolü
  if (!isPasswordComplex(password)) {
    return NextResponse.json({
      result_message: {
        code: "WEAK_PASSWORD",
        message: "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir sayı içermelidir",
        status: "error",
      }
    }, { status: 400 });
  }
  
  const pool = await getPool();
  
  // Kullanıcıyı alarak orijinal şifreyi ve diğer bilgileri görelim
  const [userQuery] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
  const userBeforeUpdate = userQuery[0];
  
  if (!userBeforeUpdate) {
    return NextResponse.json({
      result_message: {
        code: "USER_NOT_FOUND",
        message: "Kullanıcı bulunamadı",
        status: "error",
      }
    }, { status: 404 });
  }
  
  console.log("[Debug] Veritabanındaki mevcut hash:", userBeforeUpdate.password);
  console.log("[Debug] Veritabanındaki hash uzunluğu:", userBeforeUpdate.password?.length);
  
  // Mevcut kullanıcıyı ve şifreyi kontrol et
  if (currentPassword) {
    const hashedCurrentPassword = await hashPassword(currentPassword);
    if (!comparePassword(hashedCurrentPassword, userBeforeUpdate.password)) {
      return NextResponse.json({
        result_message: {
          code: "CURRENT_PASSWORD_INCORRECT",
          message: "Mevcut şifre hatalı",
          status: "error",
        }
      }, { status: 401 });
    }
  }
  
  // Şifreyi hashle
  const hashedPassword = await hashPassword(password);
  
  try {
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
    
    const [afterUpdate] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
    const userAfterUpdate = afterUpdate[0];
    
    console.log("[Debug] Güncellemeden sonra veritabanındaki hash:", userAfterUpdate.password);
    console.log("[Debug] Hash'ler eşleşiyor mu:", hashedPassword === userAfterUpdate.password);
    
    return NextResponse.json({
      result_message: {
        code: "SUCCESS",
        message: "Şifre başarıyla güncellendi",
        status: "success",
      }
    });
  } catch (error) {
    console.error("Şifre güncellenirken hata oluştu:", error);
    return NextResponse.json({
      result_message: {
        code: "UPDATE_FAILED",
        message: "Şifre güncellenirken bir hata oluştu",
        status: "error",
      }
    }, { status: 500 });
  }
}