// here we handle the server action for the Globe page (which is a client component)

import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: {
        trip: {
          userId: session.user?.id,
        },
      },
      // we only select the fields we need to display the points on the globe
      select: {
        locationTitle: true,
        latitude: true,
        longitude: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(
      locations.map(async (location) => {
        const geoCodeResult = await getCountryFromCoordinates(
          location.latitude,
          location.longitude,
        );

        return {
          name: `${location.trip.title} - ${geoCodeResult.formattedAddress}`,
          latitude: location.latitude,
          longitude: location.longitude,
          country: geoCodeResult.country,
        };
      }),
    );
    return NextResponse.json(transformedLocations);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
