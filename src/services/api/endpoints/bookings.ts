import apiClient from '../client';
import {
  Booking,
  BookingCreationData,
  BookingUpdateData,
} from '../../../schemas/booking';

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<{ data: Booking[] }>('/holidaze/bookings');
  return response.data.data;
};

// Get a specific booking by ID
export const getBookingById = async (
  id: string,
  params?: {
    _customer?: boolean;
    _venue?: boolean;
  }
): Promise<Booking> => {
  const response = await apiClient.get<{ data: Booking }>(
    `/holidaze/bookings/${id}`,
    { params }
  );
  return response.data.data;
};

// Create a new booking
export const createBooking = async (
  bookingData: BookingCreationData
): Promise<Booking> => {
  const response = await apiClient.post<{ data: Booking }>(
    '/holidaze/bookings',
    bookingData
  );
  return response.data.data;
};

// Update a booking
export const updateBooking = async (
  id: string,
  bookingData: BookingUpdateData
): Promise<Booking> => {
  const response = await apiClient.put<{ data: Booking }>(
    `/holidaze/bookings/${id}`,
    bookingData
  );
  return response.data.data;
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<void> => {
  await apiClient.delete(`/holidaze/bookings/${id}`);
};
