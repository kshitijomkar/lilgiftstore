import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const contact = {
      id: crypto.randomUUID(),
      ...validation.data,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    await db.collection("contacts").insertOne(contact);

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Create contact error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
}

