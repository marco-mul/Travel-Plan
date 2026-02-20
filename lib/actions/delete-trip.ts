"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function deleteTrip(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const tripToDelete = await prisma.trip.findUnique({ where: { id } });

  if (!tripToDelete) {
    throw new Error("Trip not found");
  }

  if (tripToDelete.userId !== session.user.id) {
    throw new Error("Not authorized to delete this trip");
  }

  await prisma.trip.delete({ where: { id } });

  redirect("/trips");

  return { success: true };
}
