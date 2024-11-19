import { Media } from './media'; 

export interface User {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
}

export interface AuthResponse {
  data: UserWithAccessToken;
  meta: Record<string, unknown>;
}

export interface UserWithAccessToken extends User {
  accessToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ErrorResponse {
  message: string;
}
