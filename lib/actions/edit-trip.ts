"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function editTrip(
  id: string,
  updates: {
    title?: string;
    description?: string;
    imageUrl?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  

  const tripToEdit = await prisma.trip.update({
    where: { id },
    data: {
      ...updates,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
    },
  });

  return { success: true }
}
