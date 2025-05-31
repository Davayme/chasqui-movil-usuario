import Constants from 'expo-constants';

// Get API URL from app.json
export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://chasquigo-backend.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  USER: {
    PROFILE: '/users/profile',
  },
};




