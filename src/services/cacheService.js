import { CACHE_CONFIG } from "../config/api";

class CacheService {
  constructor() {
    this.cache = new Map();
    this.refreshPromises = new Map();
    this.storageKey = CACHE_CONFIG.storageKey;
    this.duration = CACHE_CONFIG.duration;
    this.staleWhileRevalidate = CACHE_CONFIG.staleWhileRevalidate;
    this.backgroundRefresh = CACHE_CONFIG.backgroundRefresh;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const { cache, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < this.duration) {
          this.cache = new Map(Object.entries(cache));
        }
      }
    } catch (error) {
      console.warn("Failed to load cache from storage:", error);
    }
  }

  saveToStorage() {
    try {
      const cache = Object.fromEntries(this.cache);
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          cache,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Failed to save cache to storage:", error);
    }
  }

  async get(key, fetchFn) {
    const cached = this.cache.get(key);

    if (cached) {
      const isStale = Date.now() - cached.timestamp > this.duration;

      if (!isStale) {
        return cached.data;
      }

      if (this.staleWhileRevalidate) {
        // Return stale data immediately and refresh in background
        this.refreshInBackground(key, fetchFn);
        return cached.data;
      }
    }

    // If no cached data or not using stale-while-revalidate, fetch fresh data
    return this.refreshData(key, fetchFn);
  }

  async refreshInBackground(key, fetchFn) {
    // Prevent multiple simultaneous refreshes for the same key
    if (this.refreshPromises.has(key)) {
      return this.refreshPromises.get(key);
    }

    const refreshPromise = (async () => {
      try {
        const data = await fetchFn();
        this.set(key, data);
      } catch (error) {
        console.warn(`Cache refresh error for key ${key}:`, error);
      } finally {
        this.refreshPromises.delete(key);
      }
    })();

    this.refreshPromises.set(key, refreshPromise);
    return refreshPromise;
  }

  async refreshData(key, fetchFn) {
    if (typeof fetchFn !== "function") {
      throw new Error("fetchFn must be a function");
    }

    try {
      const data = await fetchFn();
      this.set(key, data);
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      throw error;
    }
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.saveToStorage();
  }

  delete(key) {
    this.cache.delete(key);
    this.saveToStorage();
  }

  clear() {
    this.cache.clear();
    this.saveToStorage();
  }

  getStatus() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      config: {
        duration: this.duration,
        staleWhileRevalidate: this.staleWhileRevalidate,
        backgroundRefresh: this.backgroundRefresh,
      },
    };
  }
}

export const cacheService = new CacheService();
