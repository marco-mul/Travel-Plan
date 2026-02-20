"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { deleteTrip } from "@/lib/actions/delete-trip";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function DeleteTripButton({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();

  async function handleDeleteTrip() {
    try {
      const result = await deleteTrip(tripId);
      if (!result.success) {
        console.error("Error deleting trip:", result);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="mt-2 hover:cursor-pointer bg-red-500 text-white hover:bg-red-600">
          <Trash2 className="mr-2 h-5 w-5" /> Delete Trip
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your trip?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTrip}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
