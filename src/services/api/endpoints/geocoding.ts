import axios from "axios";

export const getLatLngFromGeocoding = async (
  location: Partial<{
    address: string;
    city: string;
    country: string;
    continent: string;
  }>
) => {
  let locationQuery = "";

  if (location.address) locationQuery += location.address;
  if (location.city)
    locationQuery += locationQuery ? `, ${location.city}` : location.city;
  if (location.country)
    locationQuery += locationQuery ? `, ${location.country}` : location.country;
  if (location.continent)
    locationQuery += locationQuery
      ? `, ${location.continent}`
      : location.continent;

  if (!locationQuery) return null;

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json`,
    {
      params: {
        address: locationQuery,
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      },
    }
  );

  if (response.data.results.length > 0) {
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  }

  return null;
};
