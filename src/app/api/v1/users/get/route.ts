import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
 try {
   const pool = await getPool();
   const [rows] = await pool.query<RowDataPacket[]>(
     `SELECT u.* ,
    ur.id as role_id, 
    ur.name as role_name 
    FROM users u
    LEFT JOIN role ur 
    ON u.role_id = ur.id
    WHERE is_active = 1  `
   );
   return NextResponse.json(rows);
 } catch (error) {
  return NextResponse.json({
    error: "Bir hata oluştu",
    message: error
  }, {
    status: 500
  });
 }
} 