import apiClient from '../client';
import { Profile, ProfileUpdateData } from '../../../schemas/profile';
import { Booking } from '../../../schemas/booking';
import { Venue } from '../../../schemas/venue';

// Get all profiles
export const getProfiles = async (params?: {
  _bookings?: boolean;
  _venues?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<Profile[]> => {
  const response = await apiClient.get<{ data: Profile[] }>(
    '/holidaze/profiles',
    { params }
  );
  return response.data.data;
};

// Get a specific profile by name
export const getProfileByName = async (
  name: string,
  params?: {
    _bookings?: boolean;
    _venues?: boolean;
  }
): Promise<Profile> => {
  const response = await apiClient.get<{ data: Profile }>(
    `/holidaze/profiles/${name}`,
    { params }
  );
  return response.data.data;
};

// Update a profile
export const updateProfile = async (
  name: string,
  profileData: ProfileUpdateData
): Promise<Profile> => {
  const response = await apiClient.put<{ data: Profile }>(
    `/holidaze/profiles/${name}`,
    profileData
  );
  return response.data.data;
};

// Get all bookings by profile
export const getBookingsByProfile = async (
  name: string,
  params?: {
    _venue?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }
): Promise<Booking[]> => {
  const response = await apiClient.get<{ data: Booking[] }>(
    `/holidaze/profiles/${name}/bookings`,
    { params }
  );
  return response.data.data;
};

// Get all venues by profile
export const getVenuesByProfile = async (
  name: string,
  params?: {
    _bookings?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }
): Promise<Venue[]> => {
  const response = await apiClient.get<{ data: Venue[] }>(
    `/holidaze/profiles/${name}/venues`,
    { params }
  );
  return response.data.data;
};



// // Search profiles (For potential use in future)
// export const searchProfiles = async (query: string): Promise<Profile[]> => {
//   const response = await apiClient.get<{ data: Profile[] }>(
//     '/holidaze/profiles/search',
//     { params: { q: query } }
//   );
//   return response.data.data;
// };
