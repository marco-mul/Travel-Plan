"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { deleteLocation } from "@/lib/actions/delete-location";
import { useRouter } from "next/navigation";

interface DeleteStopButtonProps {
  stopId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteStopButton({
  stopId,
  open,
  onOpenChange,
}: DeleteStopButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    try {
      const result = await deleteLocation(stopId);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete location: ", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this stop?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 border pt-1 pb-1 pr-3 pl-3 rounded-xl text-gray-700 hover:cursor-pointer hover:bg-gray-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive border pt-1 pb-1 pr-3 pl-3 rounded-xl text-destructive-foreground hover:cursor-pointer hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
