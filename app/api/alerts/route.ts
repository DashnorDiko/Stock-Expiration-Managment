import prisma from "@/lib/prisma";
import { toPrioritizedAlertTasks } from "@/lib/services/alerts";
import { BatchStatus } from "@/prisma/generated/client";
import { NextResponse } from "next/server";

export async function GET() {
  const batches = await prisma.batch.findMany({
    where: { status: BatchStatus.ACTIVE },
    include: {
      product: {
        select: { id: true, barcode: true, sku: true, name: true, category: true },
      },
    },
    orderBy: [{ expirationDate: "asc" }, { createdAt: "asc" }],
  });

  const tasks = toPrioritizedAlertTasks(batches);

  return NextResponse.json({ tasks });
}

