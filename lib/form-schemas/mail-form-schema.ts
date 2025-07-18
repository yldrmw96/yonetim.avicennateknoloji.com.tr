import z from "zod";

export const mailFormSchema = z.object({
  mailHost: z.string().min(1, {
    message: "Mail Host boş bırakılamaz.",
  }),
  mailPort: z.string().min(1, {
    message: "Mail Port boş bırakılamaz.",
  }),
  mailUsername: z.string().min(1, {
    message: "Mail Kullanıcı Adı boş bırakılamaz.",
  }),
  mailPassword: z.string().min(1, {
    message: "Mail Şifresi boş bırakılamaz.",
  }),
});

export type MailFormValues = z.infer<typeof mailFormSchema>;
