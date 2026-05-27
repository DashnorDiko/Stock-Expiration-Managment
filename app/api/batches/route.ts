import { getDaysUntilExpiration, getExpiryStatus } from "@/lib/dates/expiry";
import prisma from "@/lib/prisma";
import { createBatchSchema, listBatchesQuerySchema } from "@/lib/validators/batch";
import { BatchStatus } from "@/prisma/generated/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedQuery = listBatchesQuerySchema.safeParse({
    category: url.searchParams.get("category") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ error: parsedQuery.error.flatten() }, { status: 400 });
  }

  const { category, status } = parsedQuery.data;

  const batches = await prisma.batch.findMany({
    where: {
      status: status ?? BatchStatus.ACTIVE,
      ...(category ? { product: { category } } : {}),
    },
    include: {
      product: {
        select: { id: true, barcode: true, sku: true, name: true, category: true },
      },
    },
    orderBy: [{ expirationDate: "asc" }, { createdAt: "asc" }],
  });

  const enrichedBatches = batches.map((batch) => ({
    ...batch,
    daysUntilExpiration: getDaysUntilExpiration(batch.expirationDate),
    expiryStatus: getExpiryStatus(batch.expirationDate),
  }));

  return NextResponse.json({ batches: enrichedBatches });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = createBatchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { barcode, createdByStaffCode, expirationDate, locationNote, quantityEstimate } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { barcode },
    select: { id: true, isActive: true },
  });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product barcode is not active in the master table." }, { status: 404 });
  }

  const createdBy = createdByStaffCode
    ? await prisma.user.findUnique({ where: { staffCode: createdByStaffCode }, select: { id: true } })
    : null;

  const batch = await prisma.batch.create({
    data: {
      productId: product.id,
      expirationDate,
      locationNote,
      quantityEstimate,
      createdById: createdBy?.id,
    },
    include: {
      product: {
        select: { id: true, barcode: true, sku: true, name: true, category: true },
      },
    },
  });

  return NextResponse.json({ batch }, { status: 201 });
}

