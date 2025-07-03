import { jwtVerify } from "jose";
import { env } from "@/lib/env";

export const verifyAccessToken = async (token: string) => { // async ekle
  try {
    const encoder = new TextEncoder();
    const ACCESS_SECRET = encoder.encode(env.ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, ACCESS_SECRET);

    // JWT exp değeri saniye cinsinden, Date.now() milisaniye
    if (Date.now() >= (payload.exp || 0) * (1000 * 60 * 60 * 24)) { 
      return { expired: true };
    }

    return payload;
  } catch (error) {
    return null; // Hatalı token
  }
}