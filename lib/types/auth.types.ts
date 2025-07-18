import type { User } from "./User";

export interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}
