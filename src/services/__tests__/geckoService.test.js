import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchTopCoins,
  getTopCoins,
  getRequestCount,
  getCacheStatus,
} from "../geckoService";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Sample mock data to be used across tests
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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers();

    // Set up initial mock response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("API Initialization", () => {
    it("should make one successful API call", async () => {
      const result = await fetchTopCoins();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

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
