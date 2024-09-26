import apiClient from '../client';
import { AuthResponse, RegisterData, LoginData } from '../../../schemas/auth';

// Register a new user
export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/auth/register',
    userData
  );
  return response.data;
};

// Login a user
export const loginUser = async (
  credentials: LoginData
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/auth/login',
    credentials
  );
  return response.data;
};