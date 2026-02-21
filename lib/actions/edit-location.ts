"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";

export async function editLocation(
  id: string,
  updates: {
    locationTitle?: string;
    notes?: string;
    startDate?: string;
    duration?: string;
  },
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const locationToEdit = await prisma.location.update({
    where: { id },
    data: {
      ...updates,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
    },
  });

  return { success: true };
}
