import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { z } from "zod";

const customGiftSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required").optional().or(z.literal("")),
  occasion: z.string().min(1, "Occasion is required").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  budget: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = customGiftSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const customGift = {
      id: crypto.randomUUID(),
      ...validation.data,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    await db.collection("custom_gifts").insertOne(customGift);

    return NextResponse.json(customGift, { status: 201 });
  } catch (error) {
    console.error("Create custom gift request error:", error);
    return NextResponse.json(
      { error: "Failed to create custom gift request" },
      { status: 500 }
    );
  }
}
