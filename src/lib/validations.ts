import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
