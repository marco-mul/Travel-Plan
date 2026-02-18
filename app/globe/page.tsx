"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

//interface for transformed location data that we're getting from the server call fetchLocations()
interface TransformedLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  //here we use a Set to store the unique locations that we want to display on the globe
  // (similar to Array but it only stores unique values)
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set(),
  );

  //we set a state for the locations that we want to display on the globe
  const [locations, setLocations] = useState<TransformedLocation[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        //we setLocations to data and we'll send as props to the Globe component
        setLocations(data);
        const uniqueCountries = new Set<string>(
          data.map((location: TransformedLocation) => location.country),
        );
        setVisitedCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        //finally will always be called regardless of whether the try block succeeds or the catch block is executed
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  //we can set useEffect to auto-rotate the globe and set the initial zoom
  //but we want to make sure that the globeRef is defined before we call any methods on it
  //we make sur to add isLoading as a dependency to the useEffect so that it runs again 
  // when the loading state changes and the globeRef is defined
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1;
      globeRef.current.pointOfView({ altitude: 1.8 });
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-600">
      <div className="container mx-auto px-4 py-12 ">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-10 mt-20">
            It's a Small World
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-muted-foreground overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold m-2">
                  See all your travels...
                </h2>
                <div className="h-[600px] w-full relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700">
                        {" "}
                      </div>
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => "#FF5733"}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.2}
                      pointAltitude={0.1}
                      pointLat="latitude"
                      pointLng="longitude"
                      pointsMerge={false}
                      width={600}
                      height={600}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700">
                        {" "}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-900 dark:text-gray-100">
                          You have visited{" "}
                          <span className="font-bold">
                            {" "}
                            {visitedCountries.size}
                          </span>{" "}
                          {visitedCountries.size === 1
                            ? "country"
                            : "countries"}
                        </p>
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {/* we turn the Set into an array so that we can sort and map over it 
                        we could also spread the Set [...visitedCountries] instead but we wouldn't be able to sort it */}
                        {Array.from(visitedCountries)
                          .sort()
                          .map((country, key) => (
                            <div
                              key={key}
                              className=" flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors "
                            >
                              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                              <span className="font-medium">{country}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
