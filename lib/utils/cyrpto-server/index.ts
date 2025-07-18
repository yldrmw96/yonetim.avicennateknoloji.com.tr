// auth.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { env } from "@/lib/env";
import bcrypt from "bcryptjs";

// JWT secret'leri hazırlama
const encoder = new TextEncoder();
const ACCESS_SECRET = encoder.encode(env.ACCESS_TOKEN_SECRET);
const REFRESH_SECRET = encoder.encode(env.REFRESH_TOKEN_SECRET);

export function isPasswordComplex(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown;
  } catch (error) {
    if (error instanceof Error && error.name === "JWTExpired") {
      return { expired: true };
    }
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload;
  } catch (error) {
    // console.error("Refresh token error:", error);
    return null;
  }
}

export async function generateAccessToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(ACCESS_SECRET);
}

export async function generateRefreshToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Diğer export'lar
export { NextResponse, NextRequest } from "next/server";
export { cookies } from "next/headers";
export type { RowDataPacket } from "mysql2";
export { getPool } from "@/lib/connection_parameters";
