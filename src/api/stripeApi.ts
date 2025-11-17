import apiClient from './apiClient';

// Conversion rate from USD to INR (you might want to fetch this from an exchange rate API)
const USD_TO_INR_RATE = 83; // Approximate rate, update as needed

// Type guard for axios errors
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

interface CheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId?: string;
    url: string;
  };
  message?: string;
}

/**
 * Convert USD price to Indian Rupees
 * @param usdPrice - Price in USD
 * @returns Price in INR
 */
export const convertUsdToInr = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

/**
 * Create a Stripe checkout session with Indian Rupee conversion
 * @param priceId - Stripe price ID
 * @param quantity - Quantity of items (default: 1)
 * @returns Promise with checkout session details
 */
export const createCheckoutSession = async (
  priceId: string,
  quantity: number = 1
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await apiClient.post('/stripe/create-checkout-session', {
      priceId,
      quantity
    });

    return response.data;
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    const errorMessage = isAxiosError(error)
      ? (error.response?.data?.message || 'Failed to create checkout session')
      : 'Failed to create checkout session';
    throw new Error(errorMessage);
  }
};

/**
 * Create checkout session with cart total in USD
 * @param totalAmountUsd - Total amount in USD
 * @param productName - Product name for the checkout session
 * @param quantity - Total quantity of items
 * @returns Promise with checkout session details
 */
export const createCheckoutSessionFromCart = async (
  totalAmountUsd: number, // Total USD amount
  productName: string = 'Cart Items',
  quantity: number = 1
): Promise<CheckoutSessionResponse> => {
  try {
    // Send amount in USD (no conversion)
    const response = await apiClient.post('/stripe/create-checkout-session', {
      amount: totalAmountUsd,
      productName,
      quantity
    });

    // Handle direct URL response format
    if (response.data && response.data.url) {
      return {
        success: true,
        data: {
          url: response.data.url
        }
      };
    }

    // Handle wrapped response format
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating checkout session from cart:', error);
    const errorMessage = isAxiosError(error)
      ? (error.response?.data?.message || 'Failed to create checkout session')
      : 'Failed to create checkout session';
    throw new Error(errorMessage);
  }
};

export const stripeApi = {
  createCheckoutSession,
  createCheckoutSessionFromCart,
  convertUsdToInr,
};
