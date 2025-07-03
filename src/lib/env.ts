import { z } from "zod";

const envSchema = z.object({
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  SESSION_KEY: z.string(),
  REFRESH_TOKEN_EXPIRATION_TIME: z.string(),
  ACCESS_TOKEN_EXPIRATION_TIME: z.string(),
  NEXT_PUBLIC_UPLOADS_PATH: z.string(),
  REFRESH_TOKEN_KEY: z.string(),
  NEXT_PUBLIC_SITE_NAME: z.string(),
});

export const env = envSchema.parse(process.env);

