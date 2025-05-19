// API Configuration
export const API_CONFIG = {
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  rateLimit: {
    maxRequests: 10, // Reduced from 50 to be more conservative
    timeWindow: 60000, // 1 minute
    minDelay: 1000, // Minimum 1 second between requests
  },
};

// Rate Limiter Configuration
export const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
};

// Cache Configuration
export const CACHE_CONFIG = {
  storageKey: "crypto_cache",
  duration: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  backgroundRefresh: true,
};
