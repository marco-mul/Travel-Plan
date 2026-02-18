"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

export async function reorderItinerary(tripId: string, newOrder: string[]) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }
  // we use a Prisma transaction (everything succeeds or fails together) to update the order of the locations in the DB
  await prisma.$transaction(
    newOrder.map((locationId: string, key: number) =>
      prisma.location.update({
        where: { id: locationId },
        data: { order: key },
      }),
    ),
  );
}
