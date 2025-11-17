import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  searchProducts
} from '../api/productApi';
import type { 
  Product, 
  CreateProductRequest, 
  CreateProductResponse,
  GetProductsResponse,
  GetProductResponse,
  DeleteProductResponse,
  GetProductsParams,
  SearchProductsParams,
  PaginationInfo
} from '../api/productApi';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Product state interface
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  searchResults: Product[];
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  isSearching: boolean;
  searchQuery: string;
  searchPagination: PaginationInfo | null;
  loading: boolean;
  loadingMore: boolean;
  searchingMore: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  searchError: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  pagination: PaginationInfo | null;
  totalCount: number;
  searchTotalCount: number;
  hasInitialized: boolean;
}

// Initial state
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  searchResults: [],
  cart: [],
  cartTotal: 0,
  cartCount: 0,
  isSearching: false,
  searchQuery: '',
  searchPagination: null,
  loading: false,
  loadingMore: false,
  searchingMore: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  searchError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  pagination: null,
  totalCount: 0,
  searchTotalCount: 0,
  hasInitialized: false,
};

// Async thunk for creating product
export const createProductThunk = createAsyncThunk<
  Product,
  CreateProductRequest,
  {
    rejectValue: string;
  }
>(
  'product/createProduct',
  async (productData: CreateProductRequest, { rejectWithValue }) => {
    try {
      const response: CreateProductResponse = await createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create product');
    }
  }
);

// Async thunk for getting all products with pagination
export const fetchAllProducts = createAsyncThunk<
  { products: Product[]; count: number; pagination: PaginationInfo },
  GetProductsParams,
  {
    rejectValue: string;
  }
>(
  'product/fetchAllProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response: GetProductsResponse = await getAllProducts(params);
   
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

// Async thunk for loading more products (pagination)
export const loadMoreProducts = createAsyncThunk<
  { products: Product[]; count: number; pagination: PaginationInfo },
  GetProductsParams,
  {
    rejectValue: string;
  }
>(
  'product/loadMoreProducts',
  async (params, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { product: ProductState };
      
      // Use the nextCursor from current pagination state
      const cursor = state.product.pagination?.nextCursor;
      
      if (!cursor) {
        throw new Error('No more data available');
      }

      const response: GetProductsResponse = await getAllProducts({
        ...params,
        cursor,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load more products');
    }
  }
);

// Async thunk for refreshing the product list
export const refreshProducts = createAsyncThunk<
  { products: Product[]; count: number; pagination: PaginationInfo },
  GetProductsParams,
  {
    rejectValue: string;
  }
>(
  'product/refreshProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response: GetProductsResponse = await getAllProducts({
        limit: 30,
        sortOrder: 'desc',
        ...params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refresh products');
    }
  }
);

// Async thunk for searching products
export const searchProductsThunk = createAsyncThunk<
  { products: Product[]; count: number; pagination: PaginationInfo },
  SearchProductsParams,
  {
    rejectValue: string;
  }
>(
  'product/searchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response: GetProductsResponse = await searchProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search products');
    }
  }
);

// Async thunk for loading more search results
export const loadMoreSearchResults = createAsyncThunk<
  { products: Product[]; count: number; pagination: PaginationInfo },
  SearchProductsParams,
  {
    rejectValue: string;
  }
>(
  'product/loadMoreSearchResults',
  async (params, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { product: ProductState };
      
      // Use the nextCursor from current search pagination state
      const cursor = state.product.searchPagination?.nextCursor;
      
      if (!cursor) {
        throw new Error('No more search results available');
      }

      const response: GetProductsResponse = await searchProducts({
        ...params,
        cursor,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load more search results');
    }
  }
);

// Async thunk for getting product by ID
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  {
    rejectValue: string;
  }
>(
  'product/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    if (!productId || productId.trim() === '') {
      return rejectWithValue('Product ID is required');
    }
    
    try {
      const response: GetProductResponse = await getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }
);

// Async thunk for updating product
export const updateProductThunk = createAsyncThunk<
  Product,
  { productId: string; productData: Partial<CreateProductRequest> },
  {
    rejectValue: string;
  }
>(
  'product/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    if (!productId || productId.trim() === '') {
      return rejectWithValue('Product ID is required for update');
    }
    
    try {
      const response: CreateProductResponse = await updateProduct(productId, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
    }
  }
);

// Async thunk for deleting product
export const deleteProductThunk = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>(
  'product/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response: DeleteProductResponse = await deleteProduct(productId);
      console.log('Delete product API response:', response);
      return productId; // Return the deleted product ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete product');
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination = null;
      state.totalCount = 0;
      state.hasInitialized = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = null;
      state.searchTotalCount = 0;
      state.searchQuery = '';
      state.isSearching = false;
      state.searchError = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // Cart reducers
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number; selectedSize?: string; selectedColor?: string }>) => {
      const { product, quantity = 1, selectedSize, selectedColor } = action.payload;
      const existingItem = state.cart.find(item => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
          product,
          quantity,
          selectedSize,
          selectedColor
        });
      }

      // Update cart totals
      state.cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      state.cartTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      
      // Update cart totals
      state.cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      state.cartTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        
        // Update cart totals
        state.cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        state.cartTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
      state.cartTotal = 0;
    },
    // Product stock management
    updateProductStock: (state, action: PayloadAction<{ productId: string; newStock: number }>) => {
      const { productId, newStock } = action.payload;
      console.log('ProductSlice: Updating stock for product:', { productId, newStock });
      
      // Update stock in products array
      const productIndex = state.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        console.log('ProductSlice: Found product in products array at index:', productIndex);
        state.products[productIndex].stock = newStock;
      }
      
      // Update stock in search results
      const searchResultIndex = state.searchResults.findIndex(p => p.id === productId);
      if (searchResultIndex !== -1) {
        console.log('ProductSlice: Found product in search results at index:', searchResultIndex);
        state.searchResults[searchResultIndex].stock = newStock;
      }
      
      // Update stock in selected product
      if (state.selectedProduct && state.selectedProduct.id === productId) {
        console.log('ProductSlice: Updated selected product stock');
        state.selectedProduct.stock = newStock;
      }
      
      console.log('ProductSlice: Stock update complete');
    },
    resetLoadingStates: (state) => {
      state.loading = false;
      state.loadingMore = false;
      state.searchingMore = false;
    },
    resetProductState: (state) => {
      state.products = [];
      state.selectedProduct = null;
      state.searchResults = [];
      state.isSearching = false;
      state.searchQuery = '';
      state.searchPagination = null;
      state.error = null;
      state.searchError = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.pagination = null;
      state.totalCount = 0;
      state.searchTotalCount = 0;
      state.hasInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createProductThunk
      .addCase(createProductThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createProductThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.creating = false;
        state.products.unshift(action.payload); // Add new product to the beginning
        state.error = null;
        state.createSuccess = true;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create product';
        state.createSuccess = false;
      })
      
      // Handle fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.hasInitialized = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      
      // Handle loadMoreProducts
      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        // Append new products to existing list
        state.products = [...state.products, ...action.payload.products];
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload || 'Failed to load more products';
      })
      
      // Handle refreshProducts
      .addCase(refreshProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(refreshProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to refresh products';
      })
      
      // Handle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      })
      
      // Handle updateProductThunk
      .addCase(updateProductThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProductThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.updating = false;
        // Update the product in the products array
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = action.payload;
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update product';
        state.updateSuccess = false;
      })
      
      // Handle deleteProductThunk
      .addCase(deleteProductThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleting = false;
        // Remove the product from the products array
        state.products = state.products.filter(p => p.id !== action.payload);
        // Also remove from search results if present
        state.searchResults = state.searchResults.filter(p => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
        state.error = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete product';
        state.deleteSuccess = false;
      })
      
      // Handle searchProductsThunk
      .addCase(searchProductsThunk.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.products;
        state.searchPagination = action.payload.pagination;
        state.searchTotalCount = action.payload.count;
        state.searchError = null;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload || 'Failed to search products';
      })
      
      // Handle loadMoreSearchResults
      .addCase(loadMoreSearchResults.pending, (state) => {
        state.searchingMore = true;
        state.searchError = null;
      })
      .addCase(loadMoreSearchResults.fulfilled, (state, action) => {
        state.searchingMore = false;
        // Append new search results to existing list
        state.searchResults = [...state.searchResults, ...action.payload.products];
        state.searchPagination = action.payload.pagination;
        state.searchTotalCount = action.payload.count;
        state.searchError = null;
      })
      .addCase(loadMoreSearchResults.rejected, (state, action) => {
        state.searchingMore = false;
        state.searchError = action.payload || 'Failed to load more search results';
      });
  },
});

export const { 
  clearProductError,
  clearSearchError,
  clearSelectedProduct, 
  clearCreateSuccess, 
  clearUpdateSuccess, 
  clearDeleteSuccess, 
  clearProducts,
  clearSearchResults,
  setSearchQuery,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  updateProductStock,
  resetLoadingStates,
  resetProductState 
} = productSlice.actions;

export default productSlice.reducer;