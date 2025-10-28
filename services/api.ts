// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://192.168.1.8:8000/api';

// ============================================
// INTERFACES
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
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

export interface UserProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string | null;
  bio: string;
  website: string;
  location: string;
  birth_date: string;
  age: number;
  is_private: boolean;
  is_verified: boolean;
  is_email_verified: boolean;
  profile_visibility: string;
  follower_count: number;
  following_count: number;
  posts_count: number;
  mutual_followers_count: number;
  last_seen: string;
  date_joined: string;
  show_online_status: boolean;
  allow_messages_from: string;
  allow_tag: boolean;
}

// ============================================
// TOKEN MANAGEMENT (separate access & refresh)
// ============================================

const ACCESS_TOKEN_KEY = '@pixelfeed_access_token';
const REFRESH_TOKEN_KEY = '@pixelfeed_refresh_token';

export const tokenManager = {
  // Access token helpers
  saveAccessToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
      console.log('✅ Access token saved successfully');
    } catch (error) {
      console.error('❌ Error saving access token:', error);
      throw error;
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        console.log('✅ Access token retrieved successfully');
      } else {
        console.log('⚠️ No access token found');
      }
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  },

  // Refresh token helpers
  saveRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
      console.log('✅ Refresh token saved successfully');
    } catch (error) {
      console.error('❌ Error saving refresh token:', error);
      throw error;
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (token) {
        console.log('✅ Refresh token retrieved successfully');
      } else {
        console.log('⚠️ No refresh token found');
      }
      return token;
    } catch (error) {
      console.error('❌ Error getting refresh token:', error);
      return null;
    }
  },

  // Clear both tokens
  clearTokens: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      console.log('✅ Tokens cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
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
    'Accept': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Add Bearer token to all requests
// ============================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
  // Retrieve access token from AsyncStorage
  const token = await tokenManager.getAccessToken();

      if (token) {
        // Add Bearer token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Bearer token added to request:', config.url);
      } else {
        console.log('⚠️ No token available for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ============================================

api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      console.error('❌ API Error:', {
        status,
        url: error.config?.url,
        data: error.response.data,
      });

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        await tokenManager.clearTokens();
        console.log('🔓 Unauthorized - Tokens cleared. User needs to log in again.');
        
        // You can dispatch a logout action or navigate to login here
        // Example: store.dispatch(logout());
        // Example: NavigationService.navigate('Login');
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('🚫 Forbidden - Insufficient permissions');
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('🔍 Not Found - Resource does not exist');
      }

      // Handle 500 Server Error
      if (status >= 500) {
        console.error('🔥 Server Error - Something went wrong on the server');
      }
    } else if (error.request) {
      // Network error - No response received
      console.error('📡 Network Error:', error.message);
      console.error('Check your internet connection or API server status');
    } else {
      // Request configuration error
      console.error('⚙️ Request Configuration Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION APIs
// ============================================

/**
 * Login user with credentials
 * Automatically saves the token with Bearer prefix
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    console.log('🔐 Attempting login for user:', credentials.username);

    const response = await api.post<LoginResponse>(
      '/accounts/login/',
      credentials
    );


    // Save access & refresh tokens after successful login
    if (response.data.access) {
      await tokenManager.saveAccessToken(response.data.access);
      if (response.data.refresh) {
        await tokenManager.saveRefreshToken(response.data.refresh);
      }
      // Immediately check if access token is available after saving
      const savedToken = await tokenManager.getAccessToken();
      if (savedToken) {
        console.log('✅ Login successful, access token saved and verified:', savedToken.substring(0, 20) + '...');
      } else {
        console.error('❌ Access token was not found after saving!');
      }
    } else {
      console.warn('⚠️ Login succeeded but no access token received');
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.non_field_errors?.[0] ||
      'Login failed. Please check your credentials and try again.';

    throw new Error(errorMessage);
  }
};

/**
 * Register new user
 */
export const signup = async (
  credentials: SignupCredentials
): Promise<SignupResponse> => {
  try {
    console.log('📝 Attempting signup for user:', credentials.username);

    const response = await api.post<SignupResponse>(
      '/accounts/signup/',
      credentials
    );

    console.log('✅ Signup successful');
    return response.data;
  } catch (error: any) {
    console.error('❌ Signup failed:', error.response?.data || error.message);

    // Extract specific error messages from response
    const errorData = error.response?.data;
    let errorMessage = 'Signup failed. Please try again.';

    if (errorData) {
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.username) {
        errorMessage = `Username: ${errorData.username[0]}`;
      } else if (errorData.email) {
        errorMessage = `Email: ${errorData.email[0]}`;
      } else if (errorData.password) {
        errorMessage = `Password: ${errorData.password[0]}`;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Logout user and clear token
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('🚪 Logging out user...');

    // Call logout endpoint if your backend has one
    try {
      await api.post('/accounts/logout/');
      console.log('✅ Server logout successful');
    } catch (error) {
      console.warn('⚠️ Server logout failed, clearing token anyway');
    }
  } catch (error) {
    console.error('❌ Logout API error:', error);
  } finally {
    // Always clear token locally
    await tokenManager.clearTokens();
    console.log('✅ Local logout complete');
  }
};

// ============================================
// PROFILE APIs (All use Bearer token automatically)
// ============================================

/**
 * Get paginated list of user profiles with search
 * Requires authentication - Bearer token added automatically
 */
export const getProfiles = async (
  params?: ProfileSearchParams
): Promise<PaginatedResponse<UserProfile>> => {
  try {
    console.log('👥 Fetching profiles with params:', params);

    const response = await api.get<PaginatedResponse<UserProfile>>(
      '/accounts/profiles/',
      { params }
    );

    console.log(`✅ Fetched ${response.data.results.length} profiles`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch profiles:', error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to fetch profiles. Please try again.';

    throw new Error(errorMessage);
  }
};

/**
 * Get specific user profile by username
 * Requires authentication - Bearer token added automatically
 */
export const getUserProfile = async (username: string): Promise<UserProfile> => {
  try {
    console.log('👤 Fetching profile for user:', username);

    const response = await api.get<UserProfile>(
      `/accounts/profiles/${username}/`
    );

    console.log('✅ Profile fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch user profile:', error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      `Failed to fetch profile for ${username}.`;

    throw new Error(errorMessage);
  }
};

/**
 * Get current authenticated user's profile
 * Requires authentication - Bearer token added automatically
 */
export const getCurrentUserProfile = async (): Promise<UserProfileData> => {
  try {
    console.log('🔐 Fetching current user profile...');

    const response = await api.get<UserProfileData>('/accounts/me/');

    console.log('✅ Current user profile fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch current user profile:', error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to fetch your profile. Please try again.';

    throw new Error(errorMessage);
  }
};

// ============================================
// AUTHENTICATION STATUS CHECK
// ============================================

/**
 * Check if user is authenticated by verifying token existence
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await tokenManager.getAccessToken();
  const authenticated = token !== null;
  
  console.log(authenticated ? '✅ User is authenticated' : '❌ User is not authenticated');
  return authenticated;
};

/**
 * Verify token validity with backend
 * Requires authentication - Bearer token added automatically
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    // Make a simple authenticated request to verify token
    await api.get('/accounts/me/');
    console.log('✅ Token is valid');
    return true;
  } catch (error) {
    console.log('❌ Token is invalid or expired');
    await tokenManager.clearTokens();
    return false;
  }
};

// ============================================
// EXPORT DEFAULT API INSTANCE
// ============================================

export default api;
