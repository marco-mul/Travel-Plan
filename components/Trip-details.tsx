"use client";

import { Location, Trip } from "@/app/generated/prisma/client";
import Image from "next/image";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "./Map";
import SortableItinerary from "./Sortable-itinerary";

//we create a new type that intersects the Trip type + the locations that belong to that trip
export type TripWithLocations = Trip & {
  locations: Location[];
};

interface TripDetailsClientProps {
  trip: TripWithLocations;
}

export default function TripDetailsClient({ trip }: TripDetailsClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative mt-20">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}
      <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            {trip.title}
          </h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {/* here we don't need to specify the locale for the date as it is a client component */}
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 mr-4 md:mt-0">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button className="hover:cursor-pointer">
              {" "}
              <Plus className="mr-1 h-5 w-5" />
              Add Location
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg text-gray-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg text-gray-600">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg text-gray-600">
              Map
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">
                        Dates
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round(
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                            (1000 * 60 * 60 * 24),
                        )} day(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">
                        Planned visits
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                  {trip.locations.length === 0 && (
                    <div className="flex flex-col items-center text-center p-4">
                      <p>Add locations to see them on the map</p>
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Button className="mt-2">
                          {" "}
                          <Plus className="mr-2 h-5 w-5" />
                          Add Location
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-center mt-5">
                    {trip.description}
                  </p>
                </div>
              </div>
              <div className="h-102 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex flex-col justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-center mb-4">
                Full Itinerary
              </h2>
              {trip.locations.length === 0 ? (
                <div className="flex flex-col items-center text-center p-4">
                  <p>Add locations to see the full itinerary</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="mt-2 hover:cursor-pointer">
                      {" "}
                      <Plus className="mr-1 h-5 w-5" />
                      Add Location
                    </Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary
                  locations={trip.locations}
                  tripId={trip.id}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="map" className="space-y-6">
            <div className="h-110 rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className="flex flex-col items-center text-center p-4">
                <p>Add locations to see them on the map</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="mt-2 hover:cursor-pointer">
                    {" "}
                    <Plus className="mr-1 h-5 w-5" />
                    Add Location
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="text-center">
        <Link href={`/trips/`}>
          <Button className="mt-2 hover:cursor-pointer">Back to Trips</Button>
        </Link>
      </div>
    </div>
    </div>
  );
}
