import prisma from "@/lib/prisma";
import { patchBatchSchema } from "@/lib/validators/batch";
import { BatchStatus } from "@/prisma/generated/client";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const payload = await request.json();
  const parsed = patchBatchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existingBatch = await prisma.batch.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existingBatch) {
    return NextResponse.json({ error: "Batch not found." }, { status: 404 });
  }

  if (existingBatch.status === BatchStatus.CLEARED) {
    return NextResponse.json({ error: "Cleared batches cannot be edited." }, { status: 409 });
  }

  const { archive, clearReason, expirationDate, locationNote, quantityEstimate } = parsed.data;

  const batch = await prisma.batch.update({
    where: { id },
    data: {
      ...(expirationDate ? { expirationDate } : {}),
      ...(locationNote !== undefined ? { locationNote } : {}),
      ...(quantityEstimate !== undefined ? { quantityEstimate } : {}),
      ...(clearReason ? { clearReason } : {}),
      ...(archive
        ? {
            status: BatchStatus.ARCHIVED,
            archivedAt: new Date(),
          }
        : {}),
    },
    include: {
      product: {
        select: { id: true, barcode: true, sku: true, name: true, category: true },
      },
    },
  });

  return NextResponse.json({ batch });
}

