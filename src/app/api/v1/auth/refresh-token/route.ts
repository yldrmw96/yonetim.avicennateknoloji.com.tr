import { NextRequest, NextResponse } from "next/server";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/utils/cyrpto";

interface TokenPayload {
  userId: number;
  email: string;
  first_name?: string;
  family_name?: string;
  middle_name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        {
          result_message: {
            code: "MISSING_TOKEN",
            message: "Refresh token gereklidir",
            status: "error",
          },
        },
        { status: 400 }
      );
    }

    // Refresh token'ı doğrula
    let decodedToken;
    try {
      decodedToken = verifyRefreshToken(refreshToken) as TokenPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json(
          {
            result_message: {
              code: "TOKEN_EXPIRED",
              message: "Refresh token süresi dolmuş, lütfen tekrar giriş yapın",
              status: "error",
            },
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          result_message: {
            code: "INVALID_TOKEN",
            message: "Geçersiz refresh token",
            status: "error",
          },
        },
        { status: 401 }
      );
    }

    // Yeni access token oluştur
    const newAccessToken = generateAccessToken({
      userId: decodedToken.userId,
      email: decodedToken.email,
    });

    // Refresh token'ın süresine bak, 24 saatten azsa yenile
    let newRefreshToken = refreshToken;
    const refreshTokenExp = decodedToken.exp * 1000;
    if (refreshTokenExp - Date.now() < 24 * 60 * 60 * 1000) {
      newRefreshToken = generateRefreshToken({
        userId: decodedToken.userId,
        email: decodedToken.email,
      });
    }

    const response = NextResponse.json({
      result_message: {
        code: "SUCCESS",
        message: "Token yenilendi",
        status: "success",
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

   response.cookies.set("SESSION_ID", newAccessToken, { maxAge: 15 * 60 });
   if (newRefreshToken !== refreshToken) {
     response.cookies.set("REFRESH_TOKEN", newRefreshToken, {
       maxAge: 7 * 24 * 60 * 60,
     });
   }

   return response;
  } catch (error) {
    return NextResponse.json(
      {
        result_message: {
          code: "SERVER_ERROR",
          message: "Token yenileme sırasında bir hata oluştu",
          status: "error",
        },
      },
      { status: 500 }
    );
  }
}
