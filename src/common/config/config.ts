import Constants from 'expo-constants';

// Get API URL from app.json
export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://chasquigo-backend.onrender.com';

export const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || undefined;

export const STRIPE_SECRET_KEY = Constants.expoConfig?.extra?.stripeSecretKey || undefined;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  USER: {
    PROFILE: '/users/profile',
    REGISTER: '/users/client',
  },
  PAYMENTS: {
    CREATE_PAYMENT_INTENT: '/payments/create-payment-intent',
  },
  QR: {
    GET_QR: '/qr/demo',
  },
};




