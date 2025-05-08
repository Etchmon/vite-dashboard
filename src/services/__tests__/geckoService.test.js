import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchTopCoins,
  getTopCoins,
  getCacheStatus,
  getServiceStatus,
} from "../geckoService";

// Mock fetch globally for all tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Sample mock data to be used across all tests
// Contains 3 coins with different price changes for testing
const mockData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    current_price: 50000,
    price_change_percentage_24h: 5,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    current_price: 3000,
    price_change_percentage_24h: -2,
  },
  {
    id: "solana",
    name: "Solana",
    current_price: 100,
    price_change_percentage_24h: 10,
  },
];

describe("geckoService", () => {
  // Setup before each test
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers();

    // Set up initial mock response for API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
  });

  // Cleanup after each test
  afterEach(() => {
    vi.useRealTimers();
  });

  // Test API Initialization
  // - Verifies that the initial API call works
  // - Ensures we're making the correct number of API calls
  describe("API Initialization", () => {
    it("should make one successful API call", async () => {
      const result = await fetchTopCoins();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  // Test Caching Functionality
  // - Verifies that subsequent calls use cached data
  // - Checks cache status reporting
  describe("Caching", () => {
    it("should use cached data for subsequent calls", async () => {
      // First call - should use API
      await getTopCoins();

      // Second call - should use cache
      const result = await getTopCoins();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should provide accurate cache status", async () => {
      await getTopCoins();
      const status = getCacheStatus();

      expect(status.hasData).toBe(true);
      expect(status.timestamp).toBeDefined();
      expect(status.requestCount).toBeDefined();
      expect(status.currentRequests).toBeDefined();
    });
  });

  // Test Data Processing
  // - Verifies correct identification of top gainers
  // - Verifies correct identification of top losers
  // - Verifies correct calculation of volatility
  describe("Data Processing", () => {
    it("should correctly identify top gainers", async () => {
      const data = await getTopCoins();
      const topGainer = data.reduce((prev, current) =>
        prev.price_change_percentage_24h > current.price_change_percentage_24h
          ? prev
          : current
      );
      expect(topGainer.id).toBe("solana");
    });

    it("should correctly identify top losers", async () => {
      const data = await getTopCoins();
      const topLoser = data.reduce((prev, current) =>
        prev.price_change_percentage_24h < current.price_change_percentage_24h
          ? prev
          : current
      );
      expect(topLoser.id).toBe("ethereum");
    });

    it("should correctly calculate volatility", async () => {
      const data = await getTopCoins();
      const mostVolatile = data.reduce((prev, current) =>
        Math.abs(prev.price_change_percentage_24h) >
        Math.abs(current.price_change_percentage_24h)
          ? prev
          : current
      );
      expect(mostVolatile.id).toBe("solana");
    });
  });

  // Test Error Handling
  // - Verifies that the service handles API errors gracefully
  // - Ensures cached data is returned when API fails
  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      // Clear previous mocks
      vi.clearAllMocks();

      // Mock an error response
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Should still return cached data
      const result = await getTopCoins();
      expect(result).toEqual(mockData);
    });
  });
});

describe("fetchTopCoins", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should fetch top coins successfully", async () => {
    const mockData = [
      { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
      { id: "ethereum", symbol: "eth", name: "Ethereum" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchTopCoins();
    expect(result).toEqual(mockData);
  });

  it("should handle API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Rate limit exceeded",
    });

    await expect(fetchTopCoins()).rejects.toThrow("API request failed");
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchTopCoins()).rejects.toThrow("Network error occurred");
  });
});

describe("getServiceStatus", () => {
  it("should return service status", () => {
    const status = getServiceStatus();
    expect(status).toHaveProperty("cache");
    expect(status).toHaveProperty("rateLimit");
  });
});
