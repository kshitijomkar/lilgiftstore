import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }

    const db = await getDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name,
      role: "customer",
      createdAt: new Date(),
    });

    const token = generateToken({
      id: result.insertedId.toString(),
      email,
      role: "customer",
    });

    return NextResponse.json({
      token,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
