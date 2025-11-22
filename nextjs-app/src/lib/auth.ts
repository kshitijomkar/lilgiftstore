import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Validate JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production. Set it in your environment variables.');
}
// Use development secret only in non-production environments
const SECRET = JWT_SECRET || "dev-secret-key-change-in-production";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): UserPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(
  request: NextRequest
): { user: UserPayload } | { error: string; status: number } {
  const user = getUserFromRequest(request);
  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }
  return { user };
}

export function requireAdmin(
  request: NextRequest
): { user: UserPayload } | { error: string; status: number } {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth;
  }

  if (auth.user.role !== "admin") {
    return { error: "Forbidden: Admin access required", status: 403 };
  }

  return { user: auth.user };
}
