import { NextResponse } from "next/server";

export class Error {
  constructor(public message: string, public statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
  static Unauthorized(message: string = "Unauthorized") {
    return new AuthenticationError(message, 401);
  }
  static Forbidden(message: string = "Forbidden") {
    return new AuthenticationError(message, 403);
  }

  static MissingFields(
    message: string = "Kullanıcı ID ve yeni şifre gereklidir"
  ) {
    return NextResponse.json(
      {
        result_message: {
          code: "MISSING_FIELDS",
          message: message,
        },
      },
      { status: 400 }
    );
  }

  static NotFound(message: string = "Kullanıcı bulunamadı") {
    return NextResponse.json(
      {
        result_message: {
          code: "NOT_FOUND",
          message: message,
        },
      },
      { status: 404 }
    );
  }

  static PasswordResetError(message: string = "Şifre sıfırlanırken bir hata oluştu") {
    return NextResponse.json(
      {
        result_message: {
          code: "PASSWORD_RESET_ERROR",
          message: message,
        },
      },
      { status: 500 }
    );
  }

  static BadRequest(message: string = "Bad Request") {
    return NextResponse.json(
      {
        result_message: {
          code: "BAD_REQUEST",
          message: message,
        },
      },
      { status: 400 }
    );
  }
}

