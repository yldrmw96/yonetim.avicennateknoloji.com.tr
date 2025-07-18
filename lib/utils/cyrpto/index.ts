import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

import bcrypt from "bcrypt";

export function isPasswordComplex(password: string): boolean {
  // En az 8 karakter uzunluğunda olmalı
  if (password.length < 8) return false;

  // En az bir büyük harf, bir küçük harf ve bir sayı içermeli
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
}

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
      userId: number;
      email: string;
      exp: number;
    };
    // console.log("decoded data:", decoded);

    // Süre kontrolü
    if (Date.now() >= decoded.exp * (1000 * 60 * 60 * 24)) {
      return { expired: true };
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { expired: true };
    }
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    // console.error("Refresh token doğrulama hatası:", error);
    return null;
  }
}

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME });
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
export { getTokenExpirationStatus } from "./expiration";
export { NextResponse, NextRequest } from "next/server";
export { cookies } from "next/headers";
export type { RowDataPacket } from "mysql2";
export { getPool } from "@/lib/connection_parameters";
