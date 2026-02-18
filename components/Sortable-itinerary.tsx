import { Location } from "@/app/generated/prisma/client";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useId, useState } from "react";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
        <p className="text-sm text-gray-400 truncate">{`Latitude: ${item.latitude}, Longitude: ${item.longitude}`}</p>
      </div>
      <div>Stop {`${item.order + 1}`}</div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  //useId is a hook that generates a unique id for the component,
  // we can use it to create unique ids for the sortable items
  const id = useId();
  //we want to keep track of the order of the locations in the state,
  // we set useState initial value to what we get from the DB
  //and in the sortable context we just want to get the IDs using the map function
  const [localLocations, setLocalLocations] = useState(locations);

  const handleDragEnd = async (event: DragEndEvent) => {
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
        //we then send the new order to the server to update the DB
        await reorderItinerary(
            tripId,
            newLocationsOrder.map((item) => item.id)
        )
    }
  };
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 w-full">
          {localLocations.map((item, key) => (
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
