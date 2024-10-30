import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const useWeather = (lat: number | null, lng: number | null) => {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: async () => {
      if (!lat || !lng) throw new Error("Coordinates not available");

      // URL for fetching current weather
      const url = `${BASE_URL}?latitude=${lat}&longitude=${lng}&current_weather=true`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      return data.current_weather;
    },
    enabled: !!lat && !!lng,
    retry: false,
  });
};
