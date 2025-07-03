import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(1, "Şifre gerekli"),
})

export const checkPasswordSchema = z.object({
  password: z.string().min(1, "Şifre gerekli"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CheckPasswordInput = z.infer<typeof checkPasswordSchema>
