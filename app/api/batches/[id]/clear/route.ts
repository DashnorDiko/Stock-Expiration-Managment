import prisma from "@/lib/prisma";
import { clearBatchSchema } from "@/lib/validators/batch";
import { BatchStatus } from "@/prisma/generated/client";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const payload = await request.json();
  const parsed = clearBatchSchema.safeParse(payload);

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

  if (existingBatch.status !== BatchStatus.ACTIVE) {
    return NextResponse.json({ error: "Only active batches can be cleared." }, { status: 409 });
  }

  const { clearReason, clearedByStaffCode, discardedUnits, note } = parsed.data;

  const staff = clearedByStaffCode
    ? await prisma.user.findUnique({ where: { staffCode: clearedByStaffCode }, select: { id: true } })
    : null;

  const result = await prisma.$transaction(async (tx) => {
    const batch = await tx.batch.update({
      where: { id },
      data: {
        status: BatchStatus.CLEARED,
        clearedAt: new Date(),
        clearReason: clearReason ?? null,
        clearedById: staff?.id,
      },
      include: {
        product: {
          select: { id: true, barcode: true, sku: true, name: true, category: true },
        },
      },
    });

    const shouldCreateWasteLog = discardedUnits !== undefined || note !== undefined;

    const wasteLog = shouldCreateWasteLog
      ? await tx.wasteLog.create({
          data: {
            batchId: id,
            discardedUnits,
            note,
            loggedById: staff?.id,
          },
        })
      : null;

    return { batch, wasteLog };
  });

  return NextResponse.json(result);
}

