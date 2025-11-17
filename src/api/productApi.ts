import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pagination interfaces
export interface PaginationInfo {
  hasMore: boolean;
  nextCursor: string | null;
  limit: number;
  sortOrder: 'asc' | 'desc';
}

// Get products params interface
export interface GetProductsParams {
  limit?: number;
  cursor?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search products params interface
export interface SearchProductsParams {
  query: string;
  limit?: number;
  cursor?: string;
  sortOrder?: 'asc' | 'desc';
}

// Create product request interface
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
  tags: string[];
}

// API response interfaces
export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    count: number;
    pagination: PaginationInfo;
  };
}

export interface GetProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

// Create product
export const createProduct = async (productData: CreateProductRequest): Promise<CreateProductResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required to create products');
      }
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get all products with pagination
export const getAllProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await axios.get(`${API_BASE_URL}/products?${queryParams.toString()}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Search products
export const searchProducts = async (params: SearchProductsParams): Promise<GetProductsResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const queryParams = new URLSearchParams();
    queryParams.append('query', params.query);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.cursor) queryParams.append('cursor', params.cursor);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await axios.get(`${API_BASE_URL}/products/search?${queryParams.toString()}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to search products');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<GetProductResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product details');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Update product
export const updateProduct = async (productId: string, productData: Partial<CreateProductRequest>): Promise<CreateProductResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required to update products');
      }
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
    throw new Error('An unexpected error occurred');
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<DeleteProductResponse> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Admin access required to delete products');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
    throw new Error('An unexpected error occurred');
  }
};