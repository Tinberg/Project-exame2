// components/VenueMap.tsx
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface VenueMapProps {
  lat: number;
  lng: number;
  zoom?: number;  // Optional prop for controlling zoom level
}

const defaultCenter = {
  lat: 59.911491,
  lng: 10.757933,
};

const VenueMap = ({ lat, lng, zoom = 12 }: VenueMapProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerClassName="w-100 h-100"
      zoom={zoom}
      center={{ lat: lat || defaultCenter.lat, lng: lng || defaultCenter.lng }}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
};

export default VenueMap;
//??????