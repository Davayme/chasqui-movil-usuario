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
  CITIES: {
    GET_CITIES: '/cities',
  },
  FRECUENCIES: {
    GET_FRECUENCIES: '/frequencies/search',
    GET_FREQUENCY_BY_ID: '/frequencies-buses/bus-seats/',
  },
  PAYMENTS: {
    CREATE_PAYMENT_INTENT: '/tickets/purchase',
  },
  QR: {
    GET_QR: '/qr/demo',
  },
  TICKETS: {
    GET_TICKETS_HISTORY: '/tickets-history/user/',
    GENERATE_QR: '/tickets-history/ticket/',
  },
  AWS: {
    VALIDATE_DOCUMENT: '/aws/validate-document',
  },
};




