import { Location } from "@/app/generated/prisma/client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface MapProps {
  itineraries: Location[];
}

export default function Map({ itineraries }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return <div>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }
  //we want to center the map on the first location of the trip
  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].latitude, lng: itineraries[0].longitude }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={8}
      center={center}
    >
      {itineraries.map((location, key) => (
        <Marker
          key={key}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={location.locationTitle}
        />
      ))}
    </GoogleMap>
  );
}
