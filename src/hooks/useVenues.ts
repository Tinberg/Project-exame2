// React-query
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryFunctionContext,
} from "@tanstack/react-query";
// API calls
import {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  searchVenues,
} from "../services/api/endpoints/venues";
// Schemas
import { Venue, VenueCreationData, VenuesResponse } from "../schemas/venue";

// Get all venues with infinite scroll
export const useVenues = (params?: {
  _owner?: boolean;
  _bookings?: boolean;
  sort?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useInfiniteQuery<VenuesResponse, Error>({
    queryKey: ["venues", params],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) =>
      getVenues({
        ...params,
        page: pageParam as number,
        limit: 20,
      }),
    getNextPageParam: (lastPage: VenuesResponse) =>
      lastPage.meta.nextPage ?? undefined,
    initialPageParam: 1,
  });
};

// Get a specific venue by ID
export const useVenueById = (
  id: string,
  params?: { _owner?: boolean; _bookings?: boolean }
) => {
  return useQuery<Venue, Error>({
    queryKey: ["venue", id, params],
    queryFn: () => getVenueById(id, params),
  });
};

// Create a new venue
export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation<Venue, Error, VenueCreationData>({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};

// Update a venue
export const useUpdateVenue = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<Venue, Error, Partial<VenueCreationData>>({
    mutationFn: (data) => updateVenue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venue", id] });
    },
  });
};

// Delete a venue
export const useDeleteVenue = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error>({
    mutationFn: () => deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};

// Search venues
export const useSearchVenues = (query: string) => {
  return useQuery<Venue[], Error>({
    queryKey: ["venues-search", query],
    queryFn: () => searchVenues(query),
  });
};
