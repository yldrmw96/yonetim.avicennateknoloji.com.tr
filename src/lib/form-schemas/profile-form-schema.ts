import z from "zod";


export const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır" }),
  familyName: z.string().min(2, { message: "Soyisim en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  phone: z.string().optional(),
  password: z.string().optional(),
});

// infer the type of the form schema
export type ProfileFormValues = z.infer<typeof profileFormSchema>;