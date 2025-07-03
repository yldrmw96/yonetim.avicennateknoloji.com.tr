import { verify, sign } from "jsonwebtoken"
import type { User, JWTPayload } from "@/lib/types"

export function generateToken(user: User): string {
  return sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  )
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.replace("Bearer ", "")
}
