interface GeocodeResponse {
  country: string;
  formattedAddress: string;
}

export async function getCountryFromCoordinates(
  latitude: number,
  longitude: number,
): Promise<GeocodeResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
  );
  const data = await response.json();
  const result = data.results[0];

  const countryComponent = result.address_components.find((component: any) =>
    component.types.includes("country"),
  );

  return {
    country: countryComponent.long_name || "Unknown country",
    formattedAddress: result.formatted_address,
  };
}
