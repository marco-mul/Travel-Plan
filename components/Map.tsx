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
      {itineraries.map((location, key) => {
        const title = location.locationTitle ?? "";
        const truncated = title.length > 14 ? title.slice(0, 14) + "…" : title;
        return (
          <Marker
            key={key}
            position={{ lat: location.latitude, lng: location.longitude }}
            title={title || undefined}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="54" viewBox="0 0 80 54">
                  <circle cx="40" cy="17" r="15" fill="#4F46E5" stroke="white" stroke-width="2"/>
                  <text x="40" y="22" text-anchor="middle" fill="white" font-size="14" font-family="Arial,sans-serif" font-weight="bold">${location.order + 1}</text>
                  <rect x="1" y="35" width="78" height="18" rx="4" fill="white" stroke="#e5e7eb" stroke-width="1"/>
                  <text x="40" y="48" text-anchor="middle" fill="#1F2937" font-size="10" font-family="Arial,sans-serif" font-weight="600">${truncated}</text>
                </svg>`
              )}`,
              scaledSize: new window.google.maps.Size(80, 54),
              anchor: new window.google.maps.Point(40, 17),
            }}
          />
        );
      })}
    </GoogleMap>
  );
}
