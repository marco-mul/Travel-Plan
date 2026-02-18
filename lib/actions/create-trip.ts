"use server";
//use server to avoid errors

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { auth } from "@/auth";

export async function createTrip(formData: FormData) {
  //we shouldn't get to this page if not logged in,
  // but we can also check for the session here

  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error("Missing required fields");
  }
  //we convert the date timestamps to Date objects
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // new trip is added to database with the user id from the session
  await prisma.trip.create({
    data: {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      userId: session.user.id,
    },
  });
  //once the trip is created, we redirect the user to the trips page
  redirect("/trips");
}
