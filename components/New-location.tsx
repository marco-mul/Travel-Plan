"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { addLocation } from "@/lib/actions/add-location";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
      <div className="w-full max-w-md mx-auto pt-30">
        <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add new location
          </h1>
          <form
            action={(formData: FormData) => {
              startTransition(() => {
                addLocation(formData, tripId);
              });
            }}
            className="space-y-6"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor=""
              >
                Address
              </label>
              <input
                name="address"
                type="text"
                required
                className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white-500 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <Button type="submit" className="w-full">
              {isPending ? (
                <>
                  <Loader className="animate-spin mr-2 text-background" /> Adding...
                </>
              ) : (
                "Add Location"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
