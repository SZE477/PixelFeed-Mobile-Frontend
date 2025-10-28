// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ============================================
// INTERFACES
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  message?: string;
}

export interface ProfileSearchParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export interface UserProfile {
  username: string;
  full_name: string;
  profile_picture: string;
  bio: string;
  is_verified: boolean;
  is_private: boolean;
  follower_count: number;
  following_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TOKEN_KEY = '@pixelfeed_auth_token';

export const tokenManager = {
  // Save token to AsyncStorage
  saveToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  // Get token from AsyncStorage
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Remove token from AsyncStorage
  clearToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
      throw error;
    }
  },
};

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Add token to requests
// ============================================

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Token ${token}`;
        // Use 'Bearer' if your backend uses JWT: `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ============================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      // Handle unauthorized errors (token expired or invalid)
      if (status === 401) {
        await tokenManager.clearToken();
        // You can also trigger a logout action here or navigate to login
        console.log('Unauthorized - Token cleared');
      }

      // Handle other error statuses
      console.error('API Error:', {
        status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION APIs
// ============================================

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/accounts/login/', credentials);
    
    // Save token after successful login
    if (response.data.token) {
      await tokenManager.saveToken(response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Login failed. Please try again.'
    );
  }
};

export const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>('/accounts/signup/', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Signup failed. Please try again.'
    );
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint if your backend has one
    await api.post('/accounts/logout/');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear token locally
    await tokenManager.clearToken();
  }
};

// ============================================
// PROFILE APIs
// ============================================

export const getProfiles = async (
  params?: ProfileSearchParams
): Promise<PaginatedResponse<UserProfile>> => {
  try {
    const response = await api.get<PaginatedResponse<UserProfile>>(
      '/accounts/profiles/',
      { params }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch profiles.'
    );
  }
};

export const getUserProfile = async (username: string): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>(`/accounts/profiles/${username}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch user profile.'
    );
  }
};

// ============================================
// CHECK AUTHENTICATION STATUS
// ============================================

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await tokenManager.getToken();
  return token !== null;
};

export default api;
