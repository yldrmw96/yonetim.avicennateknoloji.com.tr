import { getPool } from "@/lib/connection_parameters"
import type { RowDataPacket } from "mysql2"
import { comparePassword } from "@/lib/utils/cyrpto"
import { SessionService } from "./session.service"
import type { User } from "@/lib/types"

export class UserService {
  static async checkPassword(password: string): Promise<boolean> {
    try {
      const user = await SessionService.getUserFromCookie()
      
      if (!user) {
        return false
      }

      // Kullanıcının şifresini veritabanından al
      const pool = await getPool()
      const [rows] = await pool.query<RowDataPacket[]>("SELECT password FROM users WHERE id = ?", [user.id])

      if (rows.length === 0) {
        return false
      }

      const userPassword = rows[0].password
      return await comparePassword(password, userPassword)
    } catch (error) {
      // console.error("Check password error:", error)
      return false
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const pool = await getPool()
      const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT u.*, r.id AS role_id, r.name AS role_name
        FROM users u
        LEFT JOIN role r ON u.role_id = r.id
        WHERE u.id = ?
      `,
        [id],
      )

      return (rows[0] as User) || null
    } catch (error) {
      // console.error("Find user by id error:", error)
      return null
    }
  }
}
