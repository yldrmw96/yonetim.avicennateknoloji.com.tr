"only server"

import { cookies } from "next/headers"
import { verifyAccessToken, generateAccessToken } from "@/lib/utils/cyrpto"
import type { UserSession } from "@/lib/types/user.types"

export class SessionService {
  static async getUserFromCookie(): Promise<UserSession | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("SESSION_ID")?.value

      if (!token) {
        return null
      }

      const parsedToken = verifyAccessToken(token)
      return parsedToken as unknown as UserSession | null
    } catch (error) {
      // console.error("Get user from cookie error:", error)
      return null
    }
  }

  static async updateUserSession(newData: Partial<UserSession>): Promise<UserSession | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("SESSION_ID")?.value

      if (!token) {
        return null
      }

      const parsedToken = verifyAccessToken(token)
      if (!parsedToken) {
        return null
      }

      // exp ve iat değerlerini kaldır
      const { exp, iat, ...tokenWithoutExp } = parsedToken as any

      const updatedSession: UserSession = {
        ...tokenWithoutExp,
        ...newData,
      }

      // Yeni token oluştur
      const newToken = generateAccessToken(updatedSession)

      // Cookie'yi güncelle
      cookieStore.set("SESSION_ID", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "strict",
      })

      return updatedSession
    } catch (error) {
      // console.error("Update user session error:", error)
      return null
    }
  }

  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const cookieStore = await cookies()
      cookieStore.delete("SESSION_ID")
      cookieStore.delete("REFRESH_TOKEN")

      return {
        success: true,
        message: "Çıkış yapıldı",
      }
    } catch (error) {
      // console.error("Logout error:", error)
      return {
        success: false,
        message: "Çıkış yapılırken hata oluştu",
      }
    }
  }

  static async setCookies(accessToken: string, refreshToken: string): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set("SESSION_ID", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
    })

    cookieStore.set("REFRESH_TOKEN", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
    })
  }
}
