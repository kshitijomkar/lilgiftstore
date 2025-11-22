import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth";
import { ProductService } from "@/lib/services/product.service";
import { handleAPIError } from "@/lib/middleware/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productService = new ProductService();
    const product = await productService.getProduct(id);
    return NextResponse.json(product);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const data = await request.json();
    
    const productService = new ProductService();
    const updated = await productService.updateProduct(id, data, user.role);
    return NextResponse.json(updated);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    
    const productService = new ProductService();
    await productService.deleteProduct(id, user.role);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return handleAPIError(error);
  }
}
