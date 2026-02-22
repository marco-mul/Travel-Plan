"use client";

import { Location, Trip } from "@prisma/client";
import Image from "next/image";
import { Calendar, Delete, Loader, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect, useState, useTransition } from "react";
import Map from "./Map";
import SortableItinerary from "./Sortable-itinerary";
import { deleteTrip } from "@/lib/actions/delete-trip";
import DeleteTripButton from "./DeleteTripButton";
import { title } from "process";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { editTrip } from "@/lib/actions/edit-trip";
import { useRouter } from "next/navigation";

//we create a new type that intersects the Trip type + the locations that belong to that trip
export type TripWithLocations = Trip & {
  locations: Location[];
};

interface TripDetailsClientProps {
  trip: TripWithLocations;
}

export default function TripDetailsClient({ trip }: TripDetailsClientProps) {

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [locations, setLocations] = useState(trip.locations);

  useEffect(() => {
    setLocations(trip.locations);
  }, [trip.locations]);

  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [formData, setFormData] = useState({
    title: trip.title,
    description: trip.description,
    imageUrl: trip.imageUrl || "",
    startDate: trip.startDate.toISOString().split("T")[0],
    endDate: trip.endDate.toISOString().split("T")[0],
  });

  async function handleDelete() {
    try {
      const result = await deleteTrip(trip.id);
      if (!result.success) {
        console.error("Error deleting trip:", result);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  }

  async function handleUpdate(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      const result = await editTrip(trip.id, {
        ...formData,
      });

      if (result.success) {
        setIsEditing(false); // just close the dialog, no page reload
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update trip: ", error);
    }
  }
  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
        <div className="container mx-auto px-4 py-8 space-y-8 pb-50">
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

          <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center mt-20">
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
                <TabsTrigger
                  value="itinerary"
                  className="text-lg text-gray-600"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger value="map" className="text-lg text-gray-600">
                  Map
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Trip Overview
                    </h2>
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
                              (trip.endDate.getTime() -
                                trip.startDate.getTime()) /
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
                            {trip.locations.length === 1
                              ? "location"
                              : "locations"}
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
                    <Map itineraries={locations} />
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
                      locations={locations}
                      tripId={trip.id}
                      onReorder={setLocations}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="map" className="space-y-6">
                <div className="h-110 rounded-lg overflow-hidden shadow">
                  <Map itineraries={locations} />
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
          <div className="flex items-center justify-center text-center space-x-4">
            <Button
              onClick={() => setIsEditing(true)}
              className="mt-2 hover:cursor-pointer"
            >
              Edit Trip
            </Button>
            <DeleteTripButton tripId={trip.id} />
          </div>
        </div>
      </div>

      {/* dialogue to edit the trip */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Trip</DialogTitle>
            <DialogDescription>Make changes to your trip</DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor=""
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Trip to Mexico..."
                className={
                  "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor=""
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Trip description"
                className={
                  "w-full border border-gray-300 px-3 py-2rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor=""
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={
                    "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor=""
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={
                    "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            {/* <div>
                        <label htmlFor="">Trip Image</label>
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt="Image Preview"
                            className="w-full mb-4 rounded-md max-h-48 object-cover"
                            width={300}
                            height={100}
                          />
                        )}
                        <UploadButton
                          endpoint="imageUploader"
                          //once upload complete, we save the url to state
                          // so we can send it to the server when we create the trip
                          onClientUploadComplete={(res) => {
                            if (res && res[0].ufsUrl) {
                              setImageUrl(res[0].ufsUrl);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.log("Upload error: ", error);
                          }}
                        />
                      </div> */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="animate-spin mr-2 text-white" /> Editing
                  Trip...
                </>
              ) : (
                "Edit Trip"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
