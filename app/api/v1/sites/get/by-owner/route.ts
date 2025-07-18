import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/connection_parameters";
import { getSitesByUserIdQuery } from "@/lib/db/queries/sites.query";

export async function POST(request: NextRequest) {
  const { ownerId } = await request.json();
  const pool = await getPool();

  const [rows] = await pool.query(getSitesByUserIdQuery, [ownerId]);
  return NextResponse.json(rows);
}