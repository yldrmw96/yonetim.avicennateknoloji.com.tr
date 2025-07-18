import z from "zod";


export  const seoFormSchema = z.object({
  metaTitle: z.string().min(1, {
    message: "Meta başlığı boş bırakılamaz.",
  }),
  metaDescription: z.string().min(1, {
    message: "Meta açıklaması boş bırakılamaz.",
  }),
  metaKeywords: z.string().min(1, {
    message: "Meta anahtar kelimeleri boş bırakılamaz.",
  }),
  metaAuthor: z.string().min(1, {
    message: "Meta yazarı boş bırakılamaz.",
  }),
});

export type SeoFormValues = z.infer<typeof seoFormSchema>;
