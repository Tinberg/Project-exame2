//----- Sort Options -----//
// SortOption Interface
export interface SortOption {
  label: string;
  value: string;
  sortField: string;
  sortOrder: "asc" | "desc";
}

// Define sort options
export const sortOptions: SortOption[] = [
  {
    label: "Newest",
    value: "created_desc",
    sortField: "created",
    sortOrder: "desc",
  },
  {
    label: "Oldest",
    value: "created_asc",
    sortField: "created",
    sortOrder: "asc",
  },
  {
    label: "Price High to Low",
    value: "price_desc",
    sortField: "price",
    sortOrder: "desc",
  },
  {
    label: "Price Low to High",
    value: "price_asc",
    sortField: "price",
    sortOrder: "asc",
  },
  {
    label: "Most Guests",
    value: "maxGuests_desc",
    sortField: "maxGuests",
    sortOrder: "desc",
  },
  {
    label: "Least Guests",
    value: "maxGuests_asc",
    sortField: "maxGuests",
    sortOrder: "asc",
  },
];

//----- Continents -----//
// List of continents
export const continents = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

//----- Default map center coordinates OSLO -----//
export const center = {
  lat: 59.911491,
  lng: 10.757933,
};

//----- Valid Cordinates -----//
// Check if latitude and longitude are valid
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    lat !== 0 && 
    lng !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 90 && lng === 180) 
  );
};
