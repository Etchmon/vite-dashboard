// src/services/geckoService.js

import { API_CONFIG } from "../config/api";
import { cacheService } from "./cacheService";
import { rateLimiter } from "./rateLimiter";

// Custom Error Class for API Errors
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

// Request timeout function
const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new APIError("Request timeout", 408));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

// Retry function
const retry = async (
  fn,
  retries = API_CONFIG.retryAttempts,
  delay = API_CONFIG.retryDelay
) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
};

// Main API Fetch Function
const fetchFromAPI = async (endpoint, options = {}) => {
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    throw new APIError(`Rate limit exceeded. Please wait ${waitTime}ms`, 429);
  }

  try {
    rateLimiter.addRequest();

    const response = await timeoutPromise(
      API_CONFIG.timeout,
      fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options.headers,
        },
      })
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Network error occurred", 0, {
      originalError: error.message,
    });
  }
};

// Fetch top coins with caching
export const fetchTopCoins = async () => {
  const cacheKey = "top_coins";

  return cacheService.get(cacheKey, () =>
    retry(() =>
      fetchFromAPI(
        "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
      )
    )
  );
};

// Fetch coin details with caching
export const fetchCoinDetails = async (coinId) => {
  const cacheKey = `coin_${coinId}`;

  return cacheService.get(cacheKey, () =>
    retry(() => fetchFromAPI(`/coins/${coinId}`))
  );
};

// Fetch coin market chart with caching
export const fetchCoinMarketChart = async (coinId, days = 7) => {
  const cacheKey = `chart_${coinId}_${days}`;

  return cacheService.get(cacheKey, () =>
    retry(() =>
      fetchFromAPI(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)
    )
  );
};

// Get service status
export const getServiceStatus = () => ({
  cache: cacheService.getStatus(),
  rateLimit: rateLimiter.getStatus(),
});
