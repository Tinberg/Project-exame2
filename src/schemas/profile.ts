import { Media } from './media'; 
import { Venue } from './venue';
import { Booking } from './booking';

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
  venues?: Venue[];      
  bookings?: Booking[];  
  _count?: {
    venues: number;
    bookings: number;
  };
}

export interface ProfileUpdateData {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}
