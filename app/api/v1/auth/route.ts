import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import bcrypt from "bcrypt";

// Geçersiz giriş denemelerini takip için basit bir in-memory store
// Gerçek uygulamada bu Redis veya başka bir cache mekanizmasıyla yapılmalıdır
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

// Sabit bir şifreleme anahtarı kullanalım - update-password API'siyle aynı değeri kullanmalı


/// Login işlemi için endpoint. Request içerisinde email ve password alınır.
/// Bu bilgiler veritabanında kontrol edilir. Eğer kullanıcı bulunamazsa, 
/// kullanıcı bulunamazsa, kullanıcı bulunamaz hata mesajı döner.
/// Kullanıcı bulunursa, kullanıcı bilgileri döner.
/// Kullanıcı bilgileri içerisinde session id oluşturulur ve bu id cookie olarak kaydedilir.
/// Bu sayede, kullanıcı giriş yapmış olur.
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Boş alan kontrolü
  if (!email || !password) {
    return NextResponse.json({
      result_message: {
        code: "MISSING_FIELDS",
        message: "Email ve şifre alanları zorunludur",
        status: "error",
      },
    }, { status: 400 });
  }

  // Brute force koruması - IP ve email bazlı deneme sayısı sınırlama
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
  const attemptKey = `${ipAddress}:${email}`;
  
  const now = Date.now();
  const attempt = loginAttempts[attemptKey] || { count: 0, lastAttempt: 0 };
  
  // Son deneme üzerinden 15 dakika geçtiyse sayacı sıfırla
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    attempt.count = 0;
  }
  
  // 5 başarısız denemeden sonra geçici olarak kilitle
  // if (attempt.count >= 5) {
  //   const timeLeft = Math.ceil((attempt.lastAttempt + 15 * 60 * 1000 - now) / 60000);
    
  //   return NextResponse.json({
  //     result_message: {
  //       code: "TOO_MANY_ATTEMPTS",
  //       message: Çok fazla başarısız deneme. Lütfen ${timeLeft} dakika sonra tekrar deneyin.,
  //       status: "error",
  //     },
  //   }, { status: 429 });
  // }

  // console.log("[Login] -------------------- YENİ GİRİŞ DENEMESİ --------------------");
  // console.log("[Login] Email:", email);
  // console.log("[Login] Şifre:", password);

  const pool = await getPool();
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT u.*, r.id AS role_id, r.name AS role_name, COUNT(s.id) AS site_count
    FROM users u
    LEFT JOIN role r ON u.role_id = r.id
    LEFT JOIN sites s ON u.id = s.owner_id
    WHERE u.email = ?
    GROUP BY u.id, r.id
  `, [email]);
  const user = rows[0];

  if(!user) {
    // Güvenlik için deneme sayısını artır
    loginAttempts[attemptKey] = { 
      count: attempt.count + 1, 
      lastAttempt: now 
    };
    
    return NextResponse.json({
      result_message: {
        code: "USER_NOT_FOUND",
        message: "Kullanıcı bulunamadı. Girdiğiniz hesap bilgilerini kontrol edip tekrar deneyin.",
        status: "error",
      },
    }, { status: 404 });
  }

  // Kullanıcı hesabı aktif mi kontrolü
  if (user.is_active === 0) {
    return NextResponse.json({
      result_message: {
        code: "ACCOUNT_DEACTIVATED",
        message: "Hesabınız devre dışı bırakılmış. Lütfen yönetici ile iletişime geçin.",
        status: "error",
      },
    }, { status: 403 });
  }

  const hashedPassword = typeof user.password === "string" ? user.password : user.password.toString();
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  // console.log(isPasswordCorrect, password, hashedPassword);
  
  // Doğrudan karşılaştırma yap
  if (!isPasswordCorrect) {
    // Başarısız giriş sayacını artır
    loginAttempts[attemptKey] = { 
      count: attempt.count + 1, 
      lastAttempt: now 
    };
    
    return NextResponse.json({
      result_message: {
        code: "PASSWORD_INCORRECT",
        message: "Şifre hatalı. Girdiğiniz hesap bilgilerini kontrol edip tekrar deneyin.",
        status: "error",
      },
    }, { status: 401 });
  }

  // Başarılı giriş - deneme sayısını sıfırla
  delete loginAttempts[attemptKey];
  // console.log("[Login] Şifre doğrulandı, giriş başarılı");


  const userSitesResult = await pool.query<RowDataPacket[]>(`
    SELECT s.*
    FROM sites s
    WHERE s.owner_id = ?
  `, [user.id]);

  // console.log("userSitesResult", userSitesResult[0]);
  
  const userSites = userSitesResult[0];

  if (userSites.length === 0) {
    return NextResponse.json({
      result_message: {
        code: "NO_SITES",
        message: "Kullanıcının sitesi bulunamadı.",
        status: "error",
      },
    }, { status: 404 });
  }


  const userSelectedSiteLanguage = await pool.query<RowDataPacket[]>(`
    SELECT l.*
    FROM languages l
    WHERE l.id = ?
  `, [userSites[0].id]);

  // console.log("userSelectedSiteLanguage", userSelectedSiteLanguage);  

  const { password: _password, ...userWithoutPassword } = user;
  const accessToken = jwt.sign(
    {
      ...userWithoutPassword,
        sites: userSites,
      selectedSiteId: userSites[0].id,
      selectedSiteLanguage: userSelectedSiteLanguage[0][0],
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME }
  );
  
  const refreshToken = jwt.sign(
    { 
      ...userWithoutPassword,
    }, 
    env.REFRESH_TOKEN_SECRET, 
    { expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME }
  );

  // Cookie'yi ayarla
  const response = NextResponse.json({
    result_message: {
      code: "SUCCESS",  
      message: "Giriş başarılı",
      status: "success",
    },
    data: userWithoutPassword,
    token: accessToken,
    refreshToken: refreshToken,
  });
  
  // Cookie'yi response üzerinde ayarla
  response.cookies.set("SESSION_ID", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "strict" // CSRF koruması için
  });

  response.cookies.set("REFRESH_TOKEN", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "strict" // CSRF koruması için
  });

  // Son giriş tarihini güncelle
  try {
    await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);
  } catch (error) {
    // console.error("Son giriş tarihi güncellenirken hata oluştu:", error);
  }

  return response;
}