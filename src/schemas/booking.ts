import { Venue } from './venue';
import { Profile } from './profile';

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;      
  customer?: Profile; 
}

export interface BookingCreationData {
  dateFrom: string; 
  dateTo: string;  
  guests: number;
  venueId: string;
}

export interface BookingUpdateData {
  dateFrom?: string; 
  dateTo?: string;  
  guests?: number;
}
