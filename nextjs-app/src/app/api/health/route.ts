import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return NextResponse.json({
      status: "healthy",
      app: "The Lil Gift Corner API",
      version: "3.0.0",
      database: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        app: "The Lil Gift Corner API",
        version: "3.0.0",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
