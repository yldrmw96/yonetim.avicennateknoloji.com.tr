import z from "zod";

export const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mevcut şifre gereklidir" }),
  newPassword: z.string()
    .min(8, { message: "Şifre en az 8 karakter uzunluğunda olmalıdır" })
    .regex(/[A-Z]/, { message: "En az bir büyük harf içermelidir" })
    .regex(/[a-z]/, { message: "En az bir küçük harf içermelidir" })
    .regex(/[0-9]/, { message: "En az bir rakam içermelidir" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
