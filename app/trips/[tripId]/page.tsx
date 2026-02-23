//we keep it a server component so we can use params and auth without any issues
//and also query the database for the trip details
//however,we'll also have client side work in this page
//so we return a client component, passing the trip details as props
import { auth } from "@/auth";
import TripDetailsClient from "@/components/Trip-details";
import { prisma } from "@/lib/prisma";

export default async function TripDetails({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await auth();

  if (!session) {
    return <div>Please log in.</div>;
  }

  // here we want to get the trip in the database that matches the tripId from url params
  //we also want to include the possibly saved locations for that trip
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId: session.user?.id,
    },
    include: { locations: { orderBy: { order: "asc" } } },
  });

  console.log(trip);
  
  //in case we type in the url bar a tripId that doesn't exist
  // or doesn't belong to the user, we can show a message
  if (!trip) {
    return <div>Trip not found.</div>;
  }

  return <TripDetailsClient trip={trip} />;
}
