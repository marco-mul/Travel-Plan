"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

async function geoCodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
  );

  const data = await response.json();
  const { lat, lng } = data.results[0].geometry.location;

  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title")?.toString();
  const address = formData.get("address")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const duration = formData.get("duration")?.toString();
  const notes = formData.get("notes")?.toString();

  if (!address) {
    throw new Error("Address is required");
  }

  if (!startDate) {
    throw new Error("Start date is required");
  }

  const { lat, lng } = await geoCodeAddress(address);

  // we count the number of locations so we can add the new one in the correct order
  const count = await prisma.location.count({
    where: {
      tripId,
    },
  });

  await prisma.location.create({
    data: {
      locationTitle: title,
      address: address,
      latitude: lat,
      longitude: lng,
      tripId: tripId,
      order: count,
      startDate: new Date(startDate),
      duration: duration,
      notes: notes || null,
    },
  });

  redirect(`/trips/${tripId}`);
}
