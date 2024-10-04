
import { Media } from './media'; 
import { Profile } from './profile';
import { Booking } from './booking';

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[]; 
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: Meta;
  location: Location;
  owner?: Profile;   
  bookings?: Booking[]; 
}
export interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}


export interface VenuesResponse {
  data: Venue[];
  meta: PaginationMeta;
}
 export interface Meta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export interface Location {
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
}

export interface VenueCreationData {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Partial<Meta>;
  location?: Partial<Location>;
}
