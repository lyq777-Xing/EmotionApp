import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a custom axios instance for regular API requests
export const apiClient = axios.create({
  baseURL: "http://localhost:5081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await AsyncStorage.getItem("auth_token");

    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a custom axios instance for the emotion analysis API with CORS handling
export const emotionApiClient = axios.create({
  baseURL: "http://43.163.197.54:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle CORS for emotion API
emotionApiClient.interceptors.request.use(
  (config) => {
    // For web platform, set mode to 'cors' and add necessary headers
    if (config.headers) {
      config.headers["Access-Control-Request-Method"] = "POST";
      config.headers.Origin = "http://localhost:8081";
    }
    return config;
  },
  (error) => Promise.reject(error)
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
  user?: User;
}

// User information interface
export interface User {
  userId: number;
  email: string;
  username: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  img?: string;
}

// 图表数据项接口
export interface EmotionChartItem {
  date: string;
  intensity: number;
}

/**
 * Interface for emotion knowledge item
 */
export interface EmotionKnowledge {
  id: number;
  emotionCategory: number; // 统一使用 number 类型，0 for negative, 1 for positive
  emotionIntensity: number;
  recommendedAction: string;
  psychologicalBasis: string;
  contentType: string;
  contentUrl: string | null;
  targetNeeds: string;
  description: string;
}

/**
 * Interface for psychological analysis response
 */
export interface PsychologicalAnalysisResponse {
  authorName: string;
  role: {
    label: string;
  };
  items: {
    $type: string;
    text: string;
    modelId: string;
  }[];
  modelId: string;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/account/login",
      credentials
    );
    console.log("Login response:", response.data);
    if (response.data?.token) {
      // Store token in AsyncStorage
      await AsyncStorage.setItem("auth_token", response.data.token);

      // Fetch user data if not included in login response
      const res = await apiClient.get<User>("/account/current");
      if (res.data) {
        // Store user info in AsyncStorage
        await AsyncStorage.setItem("user_info", JSON.stringify(res.data));
        console.log("Fetched user info:", res.data);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we already have user info in storage
    const storedUserInfo = await AsyncStorage.getItem("user_info");
    if (storedUserInfo) {
      return JSON.parse(storedUserInfo);
    }

    // If not, fetch from API
    const response = await apiClient.get<User>("/account/current");
    if (response.data) {
      // Store user info in AsyncStorage
      await AsyncStorage.setItem("user_info", JSON.stringify(response.data));
      console.log("Fetched current user:", response.data);
      // Return user data
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post("/account/register", userData);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

/**
 * Logout - clear stored token and user info
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("user_info");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * Check if user is logged in (has valid token)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return !!token;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

/**
 * Get emotion data list
 */
export const getEmotionChart = async (
  content: string,
  id: number
): Promise<EmotionChartItem[]> => {
  try {
    const response = await apiClient.get(
      `/analysis/chart/${content}?userId=${id}`
    );
    console.log(`Emotion chart ${content} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch emotion list:", error);
    throw error;
  }
};

/**
 * Get emotion knowledge list
 */
export const getEmotionKnowledgeList = async (): Promise<EmotionKnowledge[]> => {
  try {
    const response = await apiClient.get('/EmotionKnowledge/list');
    console.log('Emotion knowledge response:', response.data);
    
    // 对API响应数据进行类型规范化，确保数据类型一致
    const normalizedKnowledge = response.data.map((item: Record<string, unknown>) => ({
      ...item,
      emotionCategory: typeof item.emotionCategory === 'string' 
        ? Number.parseInt(item.emotionCategory, 10) 
        : item.emotionCategory,
      emotionIntensity: typeof item.emotionIntensity === 'string'
        ? Number.parseFloat(item.emotionIntensity)
        : item.emotionIntensity
    })) as EmotionKnowledge[];
    
    return normalizedKnowledge;
  } catch (error) {
    console.error('Failed to fetch emotion knowledge list:', error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------------------------------

/**
 * Analyze emotion from text content
 * Uses a CORS workaround for web platform
 */
export const analyzeEmotion = async (
  content: string
): Promise<{ emotion: string; intensity: number }> => {
  try {
    // Check if running on web platform
    if (typeof window !== "undefined") {
      // For web, use a proxy approach or direct request with no-cors mode
      // Option 1: Try with proper CORS headers first
      try {
        const response = await emotionApiClient.post("/emotion/analyze", {
          text: content,
        });
        return response.data;
      } catch (corsError) {
        console.log(
          "CORS error, falling back to alternative method:",
          corsError
        );

        // Option 2: Fallback to using a locally hosted proxy if available
        // This would require setting up a proxy server in your development environment
        try {
          const proxyResponse = await apiClient.post("/proxy/emotion", {
            text: content,
          });
          return proxyResponse.data;
        } catch (proxyError) {
          console.error("Proxy request failed:", proxyError);

          // Option 3: Return mock data as last resort (for development)
          console.warn("Using mock emotion data due to CORS issues");
          return mockEmotionAnalysis(content);
        }
      }
    } else {
      // For native platforms, use direct request (no CORS issues)
      const response = await emotionApiClient.post("/emotion/analyze", {
        text: content,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Emotion analysis failed:", error);
    return mockEmotionAnalysis(content);
  }
};

/**
 * Generate mock emotion analysis result for development/fallback
 */
const mockEmotionAnalysis = (
  content: string
): { emotion: string; intensity: number } => {
  // Simple sentiment analysis logic based on keywords
  const positiveWords = [
    "happy",
    "good",
    "great",
    "excellent",
    "love",
    "enjoy",
    "positive",
    "开心",
    "高兴",
    "快乐",
    "喜欢",
    "爱",
  ];
  const negativeWords = [
    "sad",
    "bad",
    "awful",
    "terrible",
    "hate",
    "dislike",
    "negative",
    "伤心",
    "难过",
    "讨厌",
    "厌恶",
    "痛苦",
  ];

  const contentLower = content.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of positiveWords) {
    if (contentLower.includes(word)) positiveCount++;
  }

  for (const word of negativeWords) {
    if (contentLower.includes(word)) negativeCount++;
  }

  // Determine emotion (0 for negative, 1 for positive)
  const emotion = positiveCount >= negativeCount ? "1" : "0";

  // Calculate intensity (between 0.3 and 0.9)
  const totalCount = positiveCount + negativeCount;
  const intensity =
    totalCount > 0 ? Math.max(0.3, Math.min(0.9, totalCount / 10 + 0.3)) : 0.5;

  return { emotion, intensity };
};

/**
 * Get emotion knowledge recommendations based on category and intensity
 */
export const getEmotionKnowledgeRecommendations = async (
  category: number,
  intensity: number
): Promise<EmotionKnowledge[]> => {
  try {
    const response = await apiClient.get('/EmotionKnowledge/recommend', {
      params: {
        category,
        intensity
      }
    });
    
    console.log('情绪知识推荐API响应:', response.data);
    
    // 对API响应数据进行类型规范化
    const normalizedRecommendations = response.data.map((rec: Record<string, unknown>) => ({
      ...rec,
      emotionCategory: typeof rec.emotionCategory === 'string' 
        ? Number.parseInt(rec.emotionCategory, 10) 
        : rec.emotionCategory,
      emotionIntensity: typeof rec.emotionIntensity === 'string'
        ? Number.parseFloat(rec.emotionIntensity)
        : rec.emotionIntensity
    })) as EmotionKnowledge[];
    
    return normalizedRecommendations;
  } catch (error) {
    console.error('获取情绪知识推荐失败:', error);
    throw error;
  }
};

/**
 * Get psychological analysis using ABC theory
 */
export const getAbcAnalysis = async (context: string): Promise<string> => {
  try {
    const response = await apiClient.get<PsychologicalAnalysisResponse>('/gemma3', {
      params: {
        theory: 'abc',
        context
      }
    });
    
    console.log('ABC分析API响应:', response.data);
    return response.data.items[0].text;
  } catch (error) {
    console.error('ABC分析请求失败:', error);
    throw error;
  }
};

/**
 * Get psychological analysis using Maslow's hierarchy of needs
 */
export const getMaslowAnalysis = async (context: string): Promise<string> => {
  try {
    const response = await apiClient.get<PsychologicalAnalysisResponse>('/gemma3', {
      params: {
        theory: 'maslow',
        context
      }
    });
    
    console.log('马斯洛分析API响应:', response.data);
    return response.data.items[0].text;
  } catch (error) {
    console.error('马斯洛分析请求失败:', error);
    throw error;
  }
};
