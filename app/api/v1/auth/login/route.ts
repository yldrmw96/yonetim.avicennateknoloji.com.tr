import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth.service"
import { SessionService } from "@/lib/services/session.service"
import { loginSchema } from "@/lib/schemas"
import { validateSchema, formatValidationErrors } from "@/lib/utils/validation.utils"
import { HTTP_STATUS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    const validation = validateSchema(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          result_message: {
            code: "VALIDATION_ERROR",
            message: "Geçersiz veri",
            status: "error",
          },
          details: formatValidationErrors(validation.errors!),
        },
        {
          status: HTTP_STATUS.BAD_REQUEST
        },
      )
    }

    // IP adresini al
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Login servisini çağır
    const result = await AuthService.login(validation.data!, ipAddress)

    if (result.result_message.status === "error") {
      const statusCode =
        result.result_message.code === "TOO_MANY_ATTEMPTS"
          ? 429
          : result.result_message.code === "USER_NOT_FOUND"
            ? 404
            : result.result_message.code === "PASSWORD_INCORRECT"
              ? 401
              : 500

      return NextResponse.json(result, { status: statusCode })
    }

    // Başarılı giriş - cookie'leri ayarla
    const response = NextResponse.json(result)

    if (result.token && result.refreshToken) {
      await SessionService.setCookies(result.token, result.refreshToken)
    }

    return response
  } catch (error) {
    // console.error("Login API error:", error)
    return NextResponse.json(
      {
        result_message: {
          code: "SERVER_ERROR",
          message: "Sunucu hatası oluştu",
          status: "error",
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
