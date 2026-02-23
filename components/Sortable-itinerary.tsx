import { Location } from "@prisma/client";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useId, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Edit2,
  GripVertical,
  Loader,
  MoreVertical,
  Trash2,
  View,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { editLocation } from "@/lib/actions/edit-location";
import { useRouter } from "next/navigation";
import DeleteLocationButton from "./DeleteLocationButton";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
  onReorder?: (locations: Location[]) => void;
}

function SortableItem({ item }: { item: Location }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [formData, setFormData] = useState({
    locationTitle: item.locationTitle ?? "",
    address: item.address,
    latitude: item.latitude,
    longitude: item.longitude,
    startDate: item.startDate.toISOString().split("T")[0],
    duration: item.duration ?? "",
    notes: item.notes ?? "",
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  async function handleUpdate(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      const result = await editLocation(item.id, {
        ...formData,
      });

      if (result.success) {
        setIsEditing(false); // just close the dialog, no page reload
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update location: ", error);
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
          opacity: isDragging ? 0 : 1,
        }}
        className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
      >
        <div
          {...listeners}
          // we add the listeners to the drag handle, in this case the GripVertical icon,
          //so the event listeners doesn't interfere with the dropdown menu and the edit/view buttons
          // touch-action: none tells the browser not to scroll on touch, letting dnd-kit handle it
          className="cursor-grab text-gray-400 hover:text-gray-600"
          style={{ touchAction: "none" }}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="w-7/10">
          <h4 className="font-medium text-gray-800 dark:text-gray-300">
            {item.locationTitle}
          </h4>
          <p className="text-md text-gray-400 truncate">{`Date: ${new Date(item.startDate).toLocaleDateString()} Duration: ${item.duration}`}</p>
          <p className="text-sm text-gray-400 truncate">{`Address: ${item.address}`}</p>
          
          {item.notes && (<p className="text-sm text-gray-400 truncate">{`Notes: ${item.notes}`}</p>)}
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className=" flex items-start gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* on the first item on the dropdown, which is automatically focused by Radix, 
                we need to use onSelect instead of onClick to prevent the menu from closing
                e.preventDefault() stops Radix from running its default close-and-focus-return sequence */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsViewing(true);
                  }}
                >
                  <View className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => setIsConfirmingDelete(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>Stop {`${item.order + 1}`}</div>
        </div>
      </div>

      <DeleteLocationButton
        stopId={item.id}
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
      />

      {/* Dialog to view the stop details */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-3xl mb-4">
              {item.locationTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-bold text-xl">Stop Name:</p>
                  <p>{item.locationTitle}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-xl">Address: </p>
                  <p>{item.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-bold text-xl">Date:</p>
                  <p>{new Date(item.startDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-xl">Duration:</p>
                  <p>{item.duration}</p>
                </div>
                
              </div>
              <div className="space-y-2">
                <p className="font-bold text-xl">Notes:</p>
                <p>{item.notes}</p>
              </div>
            </div>
            <DialogFooter className="pt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsViewing(false)}
              >
                Close
              </Button>
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* dialogue to edit the stop */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Stop</DialogTitle>
            <DialogDescription>Make changes to your stop</DialogDescription>
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
                name="locationTitle"
                value={formData.locationTitle}
                onChange={(e) =>
                  setFormData({ ...formData, locationTitle: e.target.value })
                }
                className={
                  "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={
                    "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor=""
                >
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  className={
                    "w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor=""
              >
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className={
                  "w-full border border-gray-300 px-3 py-2rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="animate-spin mr-2 text-white" /> Editing
                  Stop...
                </>
              ) : (
                "Edit Stop"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
  onReorder,
}: SortableItineraryProps) {
  //useId is a hook that generates a unique id for the component,
  // we can use it to create unique ids for the sortable items
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );
  //we want to keep track of the order of the locations in the state,
  // we set useState initial value to what we get from the DB
  //and in the sortable context we just want to get the IDs using the map function
  const [localLocations, setLocalLocations] = useState(locations);
  const [activeItem, setActiveItem] = useState<Location | null>(null);

  useEffect(() => {
    setLocalLocations(locations);
  }, [locations]);

  const handleDragStart = (event: DragStartEvent) => {
    const item = localLocations.find((loc) => loc.id === event.active.id);
    setActiveItem(item ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveItem(null);
    //we check if the item was dropped in a different location, if so we update the localLocations state
    //we'll then handle the actual update of the order in the DB in a server action
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = localLocations.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = localLocations.findIndex((item) => item.id === over!.id);
      // arrayMove is a function from dnd-kit that takes the array, the old index and the new index
      // and returns a new array with the item moved to the new index
      const newLocationsOrder = arrayMove(
        localLocations,
        oldIndex,
        newIndex,
      ).map((item, index) => ({ ...item, order: index }));
      //if we didn't use map, we would see the items change place but not the order number,
      setLocalLocations(newLocationsOrder);
      onReorder?.(newLocationsOrder);
      //we then send the new order to the server to update the DB
      await reorderItinerary(
        tripId,
        newLocationsOrder.map((item) => item.id),
      );
    }
  };
  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 w-full">
          {localLocations.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className="p-4 border rounded-md flex justify-between items-center shadow-lg bg-card opacity-95">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <div className="w-7/10">
              <h4 className="font-medium text-gray-800 dark:text-gray-300">
                {activeItem.locationTitle}
              </h4>
              <p className="text-md text-gray-400 truncate">{`Date: ${new Date(activeItem.startDate).toLocaleDateString()} Duration: ${activeItem.duration}`}</p>
              <p className="text-sm text-gray-400 truncate">{`Address: ${activeItem.address}`}</p>
            </div>
            <div>Stop {`${activeItem.order + 1}`}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
