import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../../services/api/endpoints/bookings";
import {
  Booking,
  BookingCreationData,
  BookingUpdateData,
} from "../../schemas/booking";

// Get all bookings
export const useBookings = () => {
  return useQuery<Booking[], Error>({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
};

// Get a booking by ID
export const useBookingById = (
  id: string,
  params?: { _customer?: boolean; _venue?: boolean }
) => {
  return useQuery<Booking, Error>({
    queryKey: ["booking", id, params],
    queryFn: () => getBookingById(id, params),
  });
};

// Create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, BookingCreationData>({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// Update a booking
export const useUpdateBooking = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, BookingUpdateData>({
    mutationFn: (data) => updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
};

// Delete a booking
export const useDeleteBooking = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error>({
    mutationFn: () => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
