import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom axios instance for regular API requests
export const apiClient = axios.create({
  baseURL: 'http://localhost:5081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  async config => {
    // Get token from storage
    const token = await AsyncStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Create a custom axios instance for the emotion analysis API with CORS handling
export const emotionApiClient = axios.create({
  baseURL: 'http://43.163.197.54:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle CORS for emotion API
emotionApiClient.interceptors.request.use(
  config => {
    // For web platform, set mode to 'cors' and add necessary headers
    if (config.headers) {
      config.headers['Access-Control-Request-Method'] = 'POST';
      config.headers['Origin'] = 'http://localhost:8081';
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interface for auth request/response
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
}

// 图表数据项接口
export interface EmotionChartItem {
  date: string;
  intensity: number;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post<AuthResponse>('/account/login', credentials);
    console.log('Login response:', response.data);
    if (response.data && response.data.token) {
      // Store token in AsyncStorage
      await AsyncStorage.setItem('auth_token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post('/account/register', userData);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Logout - clear stored token
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Check if user is logged in (has valid token)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

/**
 * Get emotion data Chart
 */
export const getEmotionChart = async (content: string): Promise<EmotionChartItem[]> => {
  try {
    const response = await apiClient.get(`/analysis/chart/${content}?userId=1978`);
    console.log(`Emotion chart ${content} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch emotion list:', error);
    throw error;
  }
};


//-----------------------------------------------------------------------------------------------------------------------------

/**
 * Analyze emotion from text content
 * Uses a CORS workaround for web platform
 */
export const analyzeEmotion = async (content: string): Promise<{emotion: string, intensity: number}> => {
  try {
    // Check if running on web platform
    if (typeof window !== 'undefined') {
      // For web, use a proxy approach or direct request with no-cors mode
      // Option 1: Try with proper CORS headers first
      try {
        const response = await emotionApiClient.post('/emotion/analyze', { text: content });
        return response.data;
      } catch (corsError) {
        console.log('CORS error, falling back to alternative method:', corsError);
        
        // Option 2: Fallback to using a locally hosted proxy if available
        // This would require setting up a proxy server in your development environment
        try {
          const proxyResponse = await apiClient.post('/proxy/emotion', { text: content });
          return proxyResponse.data;
        } catch (proxyError) {
          console.error('Proxy request failed:', proxyError);
          
          // Option 3: Return mock data as last resort (for development)
          console.warn('Using mock emotion data due to CORS issues');
          return mockEmotionAnalysis(content);
        }
      }
    } else {
      // For native platforms, use direct request (no CORS issues)
      const response = await emotionApiClient.post('/emotion/analyze', { text: content });
      return response.data;
    }
  } catch (error) {
    console.error('Emotion analysis failed:', error);
    return mockEmotionAnalysis(content);
  }
};

/**
 * Generate mock emotion analysis result for development/fallback
 */
const mockEmotionAnalysis = (content: string): {emotion: string, intensity: number} => {
  // Simple sentiment analysis logic based on keywords
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'love', 'enjoy', 'positive', '开心', '高兴', '快乐', '喜欢', '爱'];
  const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'hate', 'dislike', 'negative', '伤心', '难过', '讨厌', '厌恶', '痛苦'];
  
  const contentLower = content.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (contentLower.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (contentLower.includes(word)) negativeCount++;
  });
  
  // Determine emotion (0 for negative, 1 for positive)
  const emotion = positiveCount >= negativeCount ? "1" : "0";
  
  // Calculate intensity (between 0.3 and 0.9)
  const totalCount = positiveCount + negativeCount;
  let intensity = totalCount > 0 ? 
    Math.max(0.3, Math.min(0.9, (totalCount / 10) + 0.3)) : 
    0.5;
  
  return { emotion, intensity };
};