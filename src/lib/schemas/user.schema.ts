import { z } from "zod"

export const updateUserSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı").optional(),
  email: z.string().email("Geçerli bir email adresi girin").optional(),
  bio: z.string().max(500, "Bio en fazla 500 karakter olabilir").optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
