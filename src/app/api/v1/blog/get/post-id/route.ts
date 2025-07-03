import { getPool } from "@/lib/connection_parameters";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  postId: z.coerce.number(),
});

export async function POST(request: NextRequest) {
  try {
    const { postId } = schema.parse(await request.json());

    const pool = await getPool();
    const query = `
    SELECT p.* FROM posts p WHERE p.id = ?  
  `;
    const [rows] = await pool.query(query, [postId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((error) => error.message).join(", ");
      console.log(errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error", errorMessage: error }, { status: 500 });
  }
} 