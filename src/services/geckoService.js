// src/services/geckoService.js

import { securityConfig } from "../config/security";

// Configuration and Constants
const apiKey = import.meta.env.VITE_API_KEY;
const cache = new Map();
const cacheKey = "topCoins";
const fetchInterval = 2 * 60 * 1000; // 2 minutes
const MAX_REQUESTS_PER_MINUTE = 10; // CoinGecko free tier limit
const requestTimestamps = [];

// Rate Limiting Logic
// - Track timestamps of recent requests
// - Remove timestamps older than 1 minute
// - Throw error if we've hit the rate limit
const checkRateLimit = () => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  // Remove old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  // Check if we've hit the limit
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  requestTimestamps.push(now);
};

// Custom Error Class for API Errors
// - Includes status code and response data
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

// Input validation function
const validateCoinId = (coinId) => {
  if (!coinId || typeof coinId !== "string") {
    throw new APIError("Invalid coin ID", 400);
  }

  if (coinId.length > securityConfig.validation.maxCoinIdLength) {
    throw new APIError("Coin ID too long", 400);
  }

  if (!securityConfig.validation.allowedCoinIdChars.test(coinId)) {
    throw new APIError("Invalid characters in coin ID", 400);
  }

  return true;
};

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

// Main API Fetch Function
// - Makes request to CoinGecko API
// - Handles rate limiting
// - Validates response
// - Caches successful responses
export const fetchTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${apiKey}`;

  try {
    // Check rate limit before making request
    checkRateLimit();

    console.log("Fetching top coins from API at", new Date().toISOString());

    const response = await timeoutPromise(
      securityConfig.api.timeout,
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add security headers
          ...securityConfig.headers,
        },
      })
    );

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();

    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new APIError("Invalid data structure received from API", 500);
    }

    // Cache successful response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      requestCount: requestTimestamps.length,
    });

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Network error occurred", 0, {
      originalError: error.message,
    });
  }
};

// Fetch coin details with validation
export const fetchCoinDetails = async (coinId) => {
  try {
    validateCoinId(coinId);

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}?x_cg_demo_api_key=${apiKey}`;

    const response = await timeoutPromise(
      securityConfig.api.timeout,
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...securityConfig.headers,
        },
      })
    );

    if (!response.ok) {
      throw new APIError(
        `Failed to fetch coin details: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coin details:", error);
    throw error;
  }
};

// Initial fetch on module load
fetchTopCoins();

// Set up interval to refresh data
setInterval(fetchTopCoins, fetchInterval);

// Public API for getting coin data
// - Returns cached data if available and fresh
// - Fetches new data if cache is empty or stale
export const getTopCoins = async () => {
  const cached = cache.get(cacheKey);
  const now = Date.now();

  // Return cached data if it's fresh
  if (cached && now - cached.timestamp < fetchInterval) {
    console.log(
      "Using cached data from:",
      new Date(cached.timestamp).toISOString(),
      "Request count:",
      cached.requestCount
    );
    return cached.data;
  }

  // Fetch new data if cache is stale or empty
  console.log("Cache expired or not found, fetching fresh data");
  return fetchTopCoins();
};

// Monitoring Functions
export const getRequestCount = () => requestTimestamps.length;
export const getCacheStatus = () => {
  const cached = cache.get(cacheKey);
  return {
    hasData: !!cached,
    timestamp: cached?.timestamp,
    requestCount: cached?.requestCount,
    currentRequests: requestTimestamps.length,
  };
};
