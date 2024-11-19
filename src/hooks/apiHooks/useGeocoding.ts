import { useQuery } from "@tanstack/react-query";
import { getLatLngFromGeocoding } from "../../services/api/endpoints/geocoding";

export const useGeocode = (location: {
  address?: string;
  city?: string;
  country?: string;
  continent?: string;
} | null) => {
  return useQuery({
    queryKey: ["geocode", location],
    queryFn: async () => {
      if (!location) {
        throw new Error("No location data provided."); 
      }
      const result = await getLatLngFromGeocoding(location);
      if (!result || !result.lat || !result.lng) {
        throw new Error("Unable to find the location. Please check the address details and try again.");
      }
      return result;
    },
    enabled: Boolean(location && Object.keys(location).length > 0),
    retry: false, 
  });
};
