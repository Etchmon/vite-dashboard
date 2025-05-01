// src/services/geckoService.js
const apiKey = import.meta.env.VITE_API_KEY;
const cache = new Map();
const cacheKey = "topCoins";
const fetchInterval = 2 * 60 * 1000; // 2 minutes
const MAX_REQUESTS_PER_MINUTE = 10; // CoinGecko free tier limit
const requestTimestamps = [];

// Rate limiting function
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

// Error handling class
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

export const fetchTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${apiKey}`;

  try {
    checkRateLimit();

    console.log("Fetching top coins from API at", new Date().toISOString());
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

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

    // Store data with timestamp and request count
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

// Initial fetch
fetchTopCoins();

// Set up interval to fetch data every 2 minutes
setInterval(fetchTopCoins, fetchInterval);

// Function checks if the cache is empty or if the data is older than the fetch interval
// If so, it fetches new data from the API
// Otherwise, it returns the cached data
export const getTopCoins = async () => {
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < fetchInterval) {
    console.log(
      "Using cached data from:",
      new Date(cached.timestamp).toISOString(),
      "Request count:",
      cached.requestCount
    );
    return cached.data;
  }

  console.log("Cache expired or not found, fetching fresh data");
  return fetchTopCoins();
};

// Function to fetch historical market data for specific coin

// Export monitoring functions for testing
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
