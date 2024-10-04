

import { useQuery } from '@tanstack/react-query';
import { getLatLngFromGeocoding } from '../services/api/endpoints/geocoding';

export const useGeocode = (location: {
  address?: string;
  city?: string;
  country?: string;
  continent?: string;
}) => {
  return useQuery({
    queryKey: ['geocode', location],
    queryFn: () => getLatLngFromGeocoding(location),
    enabled: Boolean(location && Object.keys(location).length > 0),
  });
};
