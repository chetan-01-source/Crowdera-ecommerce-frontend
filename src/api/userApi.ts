import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  address?: string;
  mobileNumber?: string;
  provider?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// API response interface
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: User;
}

// Pagination interfaces
export interface PaginationInfo {
  hasMore: boolean;
  nextCursor: string | null;
  limit: number;
  sortOrder: 'asc' | 'desc';
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    count: number;
    pagination: PaginationInfo;
  };
}

export interface GetUsersParams {
  limit?: number;
  cursor?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get all users with pagination
export const getAllUsers = async (params?: GetUsersParams): Promise<GetAllUsersResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await axios.get(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<GetUserResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Delete response interface
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const updateUserById = async (userId: string, userData: Partial<User>): Promise<GetUserResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update user details');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Delete user by ID
export const deleteUserById = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
    throw new Error('An unexpected error occurred');
  }
};