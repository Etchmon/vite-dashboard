// API Configuration
export const API_CONFIG = {
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Rate Limiter Configuration
export const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
};

// Cache Configuration
export const CACHE_CONFIG = {
  duration: 60000, // 1 minute
  storageKey: "crypto_dashboard_cache",
  staleWhileRevalidate: true, // Allow serving stale data while refreshing
  backgroundRefresh: true, // Enable background refresh
};
