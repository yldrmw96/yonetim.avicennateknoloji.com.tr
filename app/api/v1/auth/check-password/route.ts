import { comparePassword, verifyAccessToken, NextRequest, NextResponse, cookies, RowDataPacket, getPool } from "@/lib/utils/cyrpto";
type N = NextRequest;
export async function POST(request: N) {
  
  const {userId, password } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("SESSION_ID")?.value;
  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Token not found",
    });
  }
  if (verifyAccessToken(token) === null) {
    return NextResponse.json({
      success: false,
      message: "Invalid token",
    });
  }
  
  const pool = await getPool();
  const query = `
    SELECT * FROM users WHERE id = ?
  `;

  const [result] = await pool.query<RowDataPacket[]>(query, [userId]);
  if (result.length === 0) {
    return NextResponse.json({
      success: false,
      message: "User not found",
    });
  }
  if (!comparePassword(password, result[0].password)) {
    return NextResponse.json({
      success: false,
      message: "Invalid password",
    });
  }

  return NextResponse.json({
    success: true,

  });
}
  