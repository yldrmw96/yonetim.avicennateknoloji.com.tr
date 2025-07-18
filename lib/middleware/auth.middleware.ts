import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "@/lib/utils/auth.utils"
import { HTTP_STATUS } from "@/lib/constants"
import type { User } from "@/lib/types"

export interface AuthenticatedRequest extends NextRequest {
  user?: User
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get("authorization")
      const token = extractTokenFromHeader(authHeader)

      if (!token) {
        return NextResponse.json({ error: "Yetkilendirme token'ı gerekli" }, { status: HTTP_STATUS.UNAUTHORIZED })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ error: "Geçersiz token" }, { status: HTTP_STATUS.UNAUTHORIZED })
      }

      // Request nesnesine user bilgilerini ekle
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: Number(decoded.userId),
        email: decoded.email,
        role: decoded.role as any,
        name: "", // Bu bilgiyi veritabanından alabilirsiniz
      }

      return await handler(authenticatedRequest)
    } catch (error) {
      return NextResponse.json({ error: "Sunucu hatası" }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR })
    }
  }
}
