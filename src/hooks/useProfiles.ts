
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfiles, getProfileByName, updateProfile, getBookingsByProfile, getVenuesByProfile, searchProfiles } from '../services/api/endpoints/profiles';
import { Profile, ProfileUpdateData } from '../schemas/profile';
import { Booking } from '../schemas/booking';
import { Venue } from '../schemas/venue';

// Get all profiles
export const useProfiles = (params?: { _bookings?: boolean, _venues?: boolean, page?: number, limit?: number, sort?: string }) => {
  return useQuery<Profile[], Error>({
    queryKey: ['profiles', params],
    queryFn: () => getProfiles(params),
  });
};

// Get a specific profile by name
export const useProfileByName = (name: string, params?: { _bookings?: boolean, _venues?: boolean }) => {
  return useQuery<Profile, Error>({
    queryKey: ['profile', name, params],
    queryFn: () => getProfileByName(name, params),
  });
};

// Update a profile
export const useUpdateProfile = (name: string) => {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, ProfileUpdateData>({
    mutationFn: (data) => updateProfile(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', name] }); 
    },
  });
};

// Get all bookings by profile
export const useBookingsByProfile = (name: string, params?: { _venue?: boolean, page?: number, limit?: number, sort?: string }) => {
  return useQuery<Booking[], Error>({
    queryKey: ['profile-bookings', name, params],
    queryFn: () => getBookingsByProfile(name, params),
  });
};

// Get all venues by profile
export const useVenuesByProfile = (name: string, params?: { _bookings?: boolean, page?: number, limit?: number, sort?: string }) => {
  return useQuery<Venue[], Error>({
    queryKey: ['profile-venues', name, params],
    queryFn: () => getVenuesByProfile(name, params),
  });
};

// Search profiles
export const useSearchProfiles = (query: string) => {
  return useQuery<Profile[], Error>({
    queryKey: ["profiles-search", query],
    queryFn: () => searchProfiles(query),
    enabled: query.length > 0,
  });
};
