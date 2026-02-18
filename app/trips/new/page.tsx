"use client";
import { Button } from "@/components/ui/button";
//client component because this is an interactive page where people will add their trips

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

//because we're using React 19 and this is a client component but we're using  a server action
// we can use useTransition to show a loading state

export default function NewTripPage() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
    <div className="max-w-lg mx-auto pt-30">
      <Card className="pt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add a New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              //we add the image url to the form data before we send it to the server
              // the field is "imageUrl" and we send the imageUrl
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }
              startTransition(() => {
                createTrip(formData);
              });
            }}
          >
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
                placeholder="Trip to Mexico..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                )}
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
                placeholder="Trip description"
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                )}
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
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  )}
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
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  )}
                />
              </div>
            </div>
            <div>
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
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="animate-spin mr-2 text-white" /> Creating
                  Trip...
                </>
              ) : (
                "Create Trip"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
