import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

// server component so we can get the session
// but we can't get an onClick on the New Trip button, so we wrap the button in a link
export default async function TripsPage() {
  const session = await auth();

  // we get the trips for the logged in user from the database
  //so we can display them on the dashboard and also show the count of trips
  const trips = await prisma.trip.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  //we also want to get the trips by date, so we can show the past ones and the upcoming ones
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today,
  );
  const pastTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) < today,
  );

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please sign into your account to access your trips.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
      <div className="space-y-6 container mx-auto px-4 py-8">
        <div>
          <div className="flex items-center justify-between mt-20 mb-5">
            <h1 className="text-2xl font-semibold mb-4">
              {upcomingTrips.length === 0
                ? "Start planning your trips by clicking the New Trip button above!"
                : `You have ${upcomingTrips.length} upcoming ${
                    upcomingTrips.length === 1 ? "trip" : "trips"
                  } ! `}
            </h1>
            <Link href="/trips/new">
              <Button className="hover:cursor-pointer">
                {" "}
                <Plus className="mr-1 h-5 w-5" />
                New Trip
              </Button>
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <h3 className="text-xl font-medium mb-2">
                  No trips planned yet.
                </h3>
                <p className="text-center mb-4 max-w-md">
                  Start planning your trips by clicking the New Trip button
                  above!
                </p>
                <Link href="/trips/new">
                  <Button>Create Trip</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTrips.map((trip, key) => (
                  <Link key={key} href={`/trips/${trip.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">
                          {trip.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2 mb-2">
                          {trip.description}
                        </p>
                        <div className="text-sm">
                          {/* here we need to specify the locale for the date as it is a server component */}
                          {new Date(trip.startDate).toLocaleDateString("fr-FR")}{" "}
                          - {new Date(trip.endDate).toLocaleDateString("fr-FR")}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
