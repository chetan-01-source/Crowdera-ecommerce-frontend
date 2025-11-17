import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cartApi, type AddToCartRequest, type AddToCartResponse, type Cart, type CartItem } from '../api/cartApi';
import toast from 'react-hot-toast';


// Types
export interface CartState {
  cart: Cart | null;
  loading: boolean;
  addingToCart: boolean;
  error: string | null;
  cartCount: number;
  cartTotal: number;
}

export interface RemoveFromCartRequest {
  itemId: string;
  productId: string;
  quantity: number;
}

export interface CartActionResult {
  success: boolean;
  cartResponse: AddToCartResponse;
  stockUpdate?: {
    productId: string;
    newStock: number;
  };
}

// Initial state
const initialState: CartState = {
  cart: null,
  loading: false,
  addingToCart: false,
  error: null,
  cartCount: 0,
  cartTotal: 0,
};

// Async thunks
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartRequest, { rejectWithValue, dispatch }) => {
    try {
      // First, add item to cart
      const response = await cartApi.addToCart(data);
      
      // Then, update stock (subtract the quantity from stock)
      let stockUpdateResponse;
      try {
        stockUpdateResponse = await cartApi.updateStock(data.productId, {
          operation: 'subtract',
          quantity: data.quantity
        });
      } catch {
        // Continue with cart addition even if stock update fails
      }
      
      // Show success toast
      toast.success(`Added ${data.quantity} item(s) to cart!`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
        icon: '🛒',
      });
      
      // Fetch updated cart to ensure we have the latest cart state
      dispatch(fetchCartAsync());
      
      // Return both cart response and stock update info
      return {
        success: true,
        cartResponse: response,
        stockUpdate: stockUpdateResponse && stockUpdateResponse.data ? {
          productId: data.productId,
          newStock: stockUpdateResponse.data.newStock
        } : undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
        icon: '❌',
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      // Extract the actual cart data from the response
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue, dispatch }) => {
    try {
      const response = await cartApi.updateCartItem(itemId, quantity);
      
      toast.success('Cart updated successfully!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
        icon: '✅',
      });
      
      // Fetch updated cart to ensure state consistency
      dispatch(fetchCartAsync());
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
      
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
        icon: '❌',
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (data: RemoveFromCartRequest, { rejectWithValue, dispatch }) => {
    try {
      // First, remove item from cart
      const response = await cartApi.removeFromCart(data.itemId);
      
      // Then, restore stock (add the quantity back to stock)
      let stockUpdateResponse;
      try {
        stockUpdateResponse = await cartApi.updateStock(data.productId, {
          operation: 'add',
          quantity: data.quantity
        });
        
        console.log('Stock restore response:', stockUpdateResponse);
      } catch (stockError) {
        console.warn('Failed to restore stock, but item was removed from cart:', stockError);
        // Continue with cart removal even if stock update fails
      }
      
      toast.success('Item removed from cart!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
        icon: '🗑️',
      });
      
      // Fetch updated cart to ensure state consistency
      dispatch(fetchCartAsync());
      
      // Return both cart response and stock update info
      return {
        success: true,
        cartResponse: response,
        stockUpdate: stockUpdateResponse && stockUpdateResponse.data ? {
          productId: data.productId,
          newStock: stockUpdateResponse.data.newStock
        } : undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
        icon: '❌',
      });

      return rejectWithValue(errorMessage);
    }
  }
);export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      
      toast.success('Cart cleared successfully!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
        icon: '🧹',
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
        icon: '❌',
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set cart count locally (for optimistic updates)
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.addingToCart = false;
        
        console.log('AddToCartAsync fulfilled payload:', action.payload);
        
        if (action.payload.cartResponse.cart) {
          state.cart = action.payload.cartResponse.cart;
          state.cartCount = action.payload.cartResponse.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
          state.cartTotal = action.payload.cartResponse.cart.totalAmount || 0;
        } else {
          // If we don't get cart data back, optimistically update the cart count
          // This ensures the UI updates even if the API doesn't return full cart data
          console.log('No cart data in response, making optimistic update');
          state.cartCount = state.cartCount + 1; // Add 1 to current count as fallback
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload as string;
      });

    // Fetch cart
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartCount = action.payload.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        state.cartTotal = action.payload.totalAmount || 0;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update cart item
    builder
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.cart) {
          state.cart = action.payload.cart;
          state.cartCount = action.payload.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
          state.cartTotal = action.payload.cart.totalAmount || 0;
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.cartResponse.cart) {
          state.cart = action.payload.cartResponse.cart;
          state.cartCount = action.payload.cartResponse.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
          state.cartTotal = action.payload.cartResponse.cart.totalAmount || 0;
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
        state.cartCount = 0;
        state.cartTotal = 0;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, setCartCount } = cartSlice.actions;

// Export selectors
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectAddingToCart = (state: { cart: CartState }) => state.cart.addingToCart;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartCount = (state: { cart: CartState }) => state.cart.cartCount;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.cartTotal;

// Export reducer
export default cartSlice.reducer;
