import { API_CONFIG } from "../config/api";
import { rateLimiter } from "./rateLimiter";
import { cacheService } from "./cacheService";

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.headers = API_CONFIG.headers;
    this.timeout = API_CONFIG.timeout;
    this.retryAttempts = API_CONFIG.retryAttempts;
    this.retryDelay = API_CONFIG.retryDelay;
  }

  async request(endpoint, options = {}, cacheKey = null) {
    try {
      // Check rate limit
      if (!rateLimiter.canMakeRequest()) {
        const waitTime = rateLimiter.getWaitTime();
        throw new Error(`Rate limit exceeded. Please wait ${waitTime}ms`);
      }

      // If we have a cache key, use cacheService with stale-while-revalidate
      if (cacheKey) {
        return cacheService.get(cacheKey, () => {
          rateLimiter.addRequest();
          return this.makeRequestWithRetry(endpoint, options);
        });
      }

      // Otherwise, just make the request with rate limiting
      rateLimiter.addRequest();
      return this.makeRequestWithRetry(endpoint, options);
    } catch (error) {
      // If we have cached data and the request failed, return the cached data
      if (cacheKey) {
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
          console.warn(
            `Using cached data for ${cacheKey} due to error:`,
            error
          );
          return cachedData;
        }
      }
      throw error;
    }
  }

  async makeRequestWithRetry(endpoint, options, attempt = 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Resource not found: ${endpoint}`);
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        }
        if (response.status === 401) {
          throw new Error("API key is invalid or missing");
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      // Retry logic
      if (attempt < this.retryAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * attempt)
        );
        return this.makeRequestWithRetry(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  // API endpoints
  async fetchTopCoins() {
    return this.request(
      "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      {},
      "top_coins"
    );
  }

  async fetchCoinDetails(coinId) {
    return this.request(
      `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      {},
      `coin_${coinId}`
    );
  }

  async fetchCoinMarketChart(coinId, days = 7) {
    return this.request(
      `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {},
      `chart_${coinId}_${days}`
    );
  }

  // Get service status
  getStatus() {
    return {
      rateLimit: rateLimiter.getStatus(),
      cache: cacheService.getStatus(),
    };
  }
}

export const apiService = new ApiService();
