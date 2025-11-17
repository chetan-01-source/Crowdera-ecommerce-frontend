import apiClient from "./apiClient";

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  age: number;
  address: string;
  mobileNumber: string;
  role?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  address: string;
  mobileNumber: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", {
      ...data,
      role: data.role || "user", // Default to "user" role if not specified
    }),

  getCurrentUser: () => 
    apiClient.get<GetUserResponse>("/auth/profile"),
  
  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse>("/auth/refresh", data),
  
  logout: () =>
    apiClient.post("/auth/logout"),
};
