import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    const categories = await db
      .collection("products")
      .distinct("category");

    return NextResponse.json({ categories: categories || ["Gift Boxes", "Wedding", "Personalized", "Hampers"] });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ categories: ["Gift Boxes", "Wedding", "Personalized", "Hampers"] });
  }
}
