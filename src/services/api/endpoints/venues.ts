import apiClient from "../client";
import {
  Venue,
  VenueCreationData,
  PaginationMeta,
} from "../../../schemas/venue";

// Get all venues with pagination, sorting, and filtering
export const getVenues = async (params?: {
  _owner?: boolean;
  _bookings?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{ data: Venue[]; meta: PaginationMeta }> => {
  const response = await apiClient.get<{ data: Venue[]; meta: PaginationMeta }>(
    "/holidaze/venues",
    { params }
  );
  return response.data;
};

// Get a specific venue by ID
export const getVenueById = async (
  id: string,
  params?: {
    _owner?: boolean;
    _bookings?: boolean;
  }
): Promise<Venue> => {
  const response = await apiClient.get<{ data: Venue }>(
    `/holidaze/venues/${id}`,
    { params: { _owner: true, ...params } }
  );
  return response.data.data;
};

// Create a new venue
export const createVenue = async (
  venueData: VenueCreationData
): Promise<Venue> => {
  const response = await apiClient.post<{ data: Venue }>(
    "/holidaze/venues",
    venueData
  );
  return response.data.data;
};

// Update a venue
export const updateVenue = async (
  id: string,
  venueData: Partial<VenueCreationData>
): Promise<Venue> => {
  const response = await apiClient.put<{ data: Venue }>(
    `/holidaze/venues/${id}`,
    venueData
  );
  return response.data.data;
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
  await apiClient.delete(`/holidaze/venues/${id}`);
};

// Search venues
export const searchVenues = async (query: string): Promise<Venue[]> => {
  const response = await apiClient.get<{ data: Venue[] }>(
    "/holidaze/venues/search",
    { params: { q: query } }
  );
  return response.data.data;
};
