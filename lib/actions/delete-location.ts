"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

export async function deleteLocation(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const location = await prisma.location.findUnique({ where: { id } });

  if (!location) {
    throw new Error("Location not found");
  }

  await prisma.location.delete({ where: { id } });

  // re-number remaining locations so order has no gaps
  const remaining = await prisma.location.findMany({
    where: { tripId: location.tripId },
    orderBy: { order: "asc" },
  });

  await prisma.$transaction(
    remaining.map((loc, index) =>
      prisma.location.update({ where: { id: loc.id }, data: { order: index } }),
    ),
  );

  return { success: true };
}
