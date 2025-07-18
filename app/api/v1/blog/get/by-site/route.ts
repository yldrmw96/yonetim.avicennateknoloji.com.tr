import { getPool } from "@/lib/connection_parameters";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  siteId: z.coerce.number(),
});

export async function POST(request: NextRequest) {
 try {
   const { siteId } = schema.parse(await request.json());

   const pool = await getPool();
   const query = `
    SELECT p.* FROM posts p
    LEFT JOIN ownership os 
    ON p.ownership_id = os.id
    WHERE os.site_id = ?  
  `;
   const [rows] = await pool.query(query, [siteId]);

   return NextResponse.json(rows);
 } catch (error) {
  if (error instanceof z.ZodError) {
    const errorMessage = error.errors.map((error) => error.message).join(", ");
    // console.log(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
 }
} 