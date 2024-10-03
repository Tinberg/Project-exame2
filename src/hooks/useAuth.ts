// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '../services/api/endpoints/auth';
import { AuthResponse, RegisterData, LoginData } from '../schemas/auth';

// Register a new user
export const useRegisterUser = () => {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: registerUser,
  });
};

// Login a user
export const useLoginUser = () => {
  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: loginUser,
  });
};
