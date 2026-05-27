import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const barcode = url.searchParams.get("barcode")?.trim();

  if (!barcode) {
    return NextResponse.json({ error: "Missing barcode query parameter." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { barcode },
    select: {
      id: true,
      barcode: true,
      sku: true,
      name: true,
      category: true,
      isActive: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found in master table." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

