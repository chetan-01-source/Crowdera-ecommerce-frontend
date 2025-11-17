import axios from 'axios';

// Base URL for the API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types for cart operations
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart?: Cart;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

export interface CartItem {
  productId: string;
  quantity: number;
  priceAtAdd: number;
  itemTotal: number;
  addedAt: string;
  isAvailable: boolean;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productCategory: string;
  productBrand: string;
  productImages: string[];
}

export interface Cart {
  cartId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// Types for stock operations
export interface UpdateStockRequest {
  operation: 'add' | 'subtract';
  quantity: number;
}

export interface UpdateStockResponse {
  success: boolean;
  message: string;
  data: {
    productId: string;
    productName: string;
    operation: 'add' | 'subtract';
    quantity: number;
    previousStock: number;
    newStock: number;
    stockChange: string;
    updatedAt: string;
    updatedBy: string;
  };
}

// Create axios instance with default config
const cartApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for authentication if needed
cartApiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
cartApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Cart API functions
export const cartApi = {
  // Add item to cart
  addToCart: async (data: AddToCartRequest): Promise<AddToCartResponse> => {
    try {
      const response = await cartApiClient.post('/cart/add', data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to add item to cart. Please try again.'
      );
    }
  },

  // Get cart contents
  getCart: async (): Promise<CartResponse> => {
    try {
      const response = await cartApiClient.get('/cart');
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to fetch cart. Please try again.'
      );
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number): Promise<AddToCartResponse> => {
    try {
      const response = await cartApiClient.patch(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update cart item. Please try again.'
      );
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<AddToCartResponse> => {
    try {
      const response = await cartApiClient.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to remove item from cart. Please try again.'
      );
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<AddToCartResponse> => {
    try {
      const response = await cartApiClient.delete('/cart/clear');
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to clear cart. Please try again.'
      );
    }
  },

  // Update product stock
  updateStock: async (productId: string, data: UpdateStockRequest): Promise<UpdateStockResponse> => {
    try {
      const response = await cartApiClient.patch(`/products/${productId}/stock`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update product stock. Please try again.'
      );
    }
  },
};

export default cartApi;
