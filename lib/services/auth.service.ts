import { getPool } from "@/lib/connection_parameters"
import type { RowDataPacket } from "mysql2"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "@/lib/env"
import type { User, Site, Language, LoginResponse, UserSession } from "@/lib/types/user.types"
import type { LoginInput } from "@/lib/validations"

export class AuthService {
  // Login attempts tracking - production'da Redis kullanın
  private static loginAttempts: Record<string, { count: number; lastAttempt: number }> = {}

  static async login(credentials: LoginInput, ipAddress = "unknown"): Promise<LoginResponse> {
    try {
      // Brute force koruması
      const attemptResult = this.checkLoginAttempts(ipAddress, credentials.email)
      if (!attemptResult.allowed) {
        return {
          result_message: {
            code: "TOO_MANY_ATTEMPTS",
            message: `Çok fazla başarısız deneme. Lütfen birazdan tekrar deneyin.`,
            status: "error",
          },
        }
      }

      const pool = await getPool()

      // Kullanıcıyı ve rol bilgilerini getir
      const [userRows] = await pool.query<RowDataPacket[]>(
        `
        SELECT u.*, r.id AS role_id, r.name AS role_name, COUNT(s.id) AS site_count
        FROM users u
        LEFT JOIN role r ON u.role_id = r.id
        LEFT JOIN sites s ON u.id = s.owner_id
        WHERE u.email = ? AND u.is_active = 1
        GROUP BY u.id, r.id
      `,
        [credentials.email],
      )

      const user = userRows[0] as User & { password: string }

      if (!user) {
        this.recordFailedAttempt(ipAddress, credentials.email)
        return {
          result_message: {
            code: "USER_NOT_FOUND",
            message: "Kullanıcı bulunamadı. Girdiğiniz hesap bilgilerini kontrol edip tekrar deneyin.",
            status: "error",
          },
        }
      }

      // Şifre kontrolü
      const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
      if (!isPasswordCorrect) {
        this.recordFailedAttempt(ipAddress, credentials.email)
        return {
          result_message: {
            code: "PASSWORD_INCORRECT",
            message: "Şifre hatalı. Girdiğiniz hesap bilgilerini kontrol edip tekrar deneyin.",
            status: "error",
          },
        }
      }

      // Başarılı giriş - deneme sayısını sıfırla
      this.clearLoginAttempts(ipAddress, credentials.email)

      const query = `
      SELECT s.*
      FROM sites s
      RIGHT JOIN ownership o
      ON o.site_id = s.id
      WHERE o.user_id = ?
      `
      // Kullanıcının sitelerini getir
      const [siteRows] = await pool.query<RowDataPacket[]>(query, [user.id])

      const userSites = siteRows as Site[]

      if (userSites.length === 0) {
        return {
          result_message: {
            code: "NO_SITES",
            message: "Kullanıcının sitesi bulunamadı.",
            status: "error",
          },
        }
      }

      // İlk sitenin dil bilgisini getir - HATA DÜZELTİLDİ
      const [languageRows] = await pool.query<RowDataPacket[]>(
        "SELECT l.* FROM languages l WHERE l.id = ?",
        [userSites[0].language_id], // userSites[0].id yerine language_id kullanıldı
      )

      const selectedLanguage = languageRows[0] as Language

      // Şifreyi çıkar
      const { password: _password, ...userWithoutPassword } = user

      // Session data oluştur
      const sessionData: UserSession = {
        ...userWithoutPassword,
        sites: userSites,
        selectedSiteId: userSites[0].id,
        selectedSiteLanguage: selectedLanguage,
      }

      // Token'ları oluştur
      const accessToken = jwt.sign(sessionData, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME,
      })

      const refreshToken = jwt.sign({ ...userWithoutPassword }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME,
      })

      // Son giriş tarihini güncelle
      await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

      return {
        result_message: {
          code: "SUCCESS",
          message: "Giriş başarılı",
          status: "success",
        },
        data: userWithoutPassword,
        token: accessToken,
        refreshToken: refreshToken,
      }
    } catch (error) {
      // console.error("Login error:", error)
      return {
        result_message: {
          code: "SERVER_ERROR",
          message: "Sunucu hatası oluştu",
          status: "error",
        },
      }
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const pool = await getPool()
      const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email])
      return rows.length > 0
    } catch (error) {
      // console.error("Check email exists error:", error)
      return false
    }
  }

  private static checkLoginAttempts(ipAddress: string, email: string): { allowed: boolean; timeLeft?: number } {
    const attemptKey = `${ipAddress}:${email}`
    const now = Date.now()
    const attempt = this.loginAttempts[attemptKey] || { count: 0, lastAttempt: 0 }

    // Son deneme üzerinden 15 dakika geçtiyse sayacı sıfırla
    if (now - attempt.lastAttempt > 15 * 60 * 1000) {
      attempt.count = 0
    }

    // 5 başarısız denemeden sonra geçici olarak kilitle
    if (attempt.count >= 5) {
      const timeLeft = Math.ceil((attempt.lastAttempt + 15 * 60 * 1000 - now) / 60000)
      return { allowed: false, timeLeft }
    }

    return { allowed: true }
  }

  private static recordFailedAttempt(ipAddress: string, email: string): void {
    const attemptKey = `${ipAddress}:${email}`
    const now = Date.now()
    const attempt = this.loginAttempts[attemptKey] || { count: 0, lastAttempt: 0 }

    this.loginAttempts[attemptKey] = {
      count: attempt.count + 1,
      lastAttempt: now,
    }
  }

  private static clearLoginAttempts(ipAddress: string, email: string): void {
    const attemptKey = `${ipAddress}:${email}`
    delete this.loginAttempts[attemptKey]
  }
}
