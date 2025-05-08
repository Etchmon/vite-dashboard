import { CACHE_CONFIG } from "../config/api";

class CacheService {
  constructor() {
    this.memory = new Map();
    this.storage = window.localStorage;
    this.refreshPromises = new Map();
  }

  getKey(key) {
    return `${CACHE_CONFIG.storageKey}_${key}`;
  }

  async get(key, fetchFn) {
    const fullKey = this.getKey(key);

    // Try memory first
    if (this.memory.has(fullKey)) {
      const cached = this.memory.get(fullKey);
      const isStale = Date.now() - cached.timestamp > CACHE_CONFIG.duration;

      // If we have stale data and background refresh is enabled
      if (isStale && CACHE_CONFIG.backgroundRefresh) {
        // Start background refresh if not already in progress
        if (!this.refreshPromises.has(fullKey)) {
          this.refreshPromises.set(
            fullKey,
            this.refreshData(key, fetchFn).finally(() => {
              this.refreshPromises.delete(fullKey);
            })
          );
        }

        // Return stale data while refreshing
        if (CACHE_CONFIG.staleWhileRevalidate) {
          return cached.data;
        }
      }

      // Return fresh data
      if (!isStale) {
        return cached.data;
      }
    }

    // Try storage
    try {
      const stored = this.storage.getItem(fullKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const isStale = Date.now() - parsed.timestamp > CACHE_CONFIG.duration;

        // If we have stale data and background refresh is enabled
        if (isStale && CACHE_CONFIG.backgroundRefresh) {
          // Start background refresh if not already in progress
          if (!this.refreshPromises.has(fullKey)) {
            this.refreshPromises.set(
              fullKey,
              this.refreshData(key, fetchFn).finally(() => {
                this.refreshPromises.delete(fullKey);
              })
            );
          }

          // Return stale data while refreshing
          if (CACHE_CONFIG.staleWhileRevalidate) {
            this.memory.set(fullKey, parsed);
            return parsed.data;
          }
        }

        // Return fresh data
        if (!isStale) {
          this.memory.set(fullKey, parsed);
          return parsed.data;
        }
      }
    } catch (error) {
      console.error("Cache storage error:", error);
    }

    // If we get here, we need to fetch fresh data
    return this.refreshData(key, fetchFn);
  }

  async refreshData(key, fetchFn) {
    try {
      const data = await fetchFn();
      await this.set(key, data);
      return data;
    } catch (error) {
      console.error("Cache refresh error:", error);
      throw error;
    }
  }

  async set(key, data) {
    const fullKey = this.getKey(key);
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };

    // Update memory
    this.memory.set(fullKey, cacheItem);

    // Update storage
    try {
      this.storage.setItem(fullKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Cache storage error:", error);
    }
  }

  async clear() {
    this.memory.clear();
    this.refreshPromises.clear();
    try {
      Object.keys(this.storage)
        .filter((key) => key.startsWith(CACHE_CONFIG.storageKey))
        .forEach((key) => this.storage.removeItem(key));
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  getStatus() {
    return {
      memorySize: this.memory.size,
      storageSize: Object.keys(this.storage).filter((key) =>
        key.startsWith(CACHE_CONFIG.storageKey)
      ).length,
      activeRefreshes: this.refreshPromises.size,
    };
  }
}

export const cacheService = new CacheService();
