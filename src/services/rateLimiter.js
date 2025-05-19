import { API_CONFIG } from "../config/api";

class RateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequests = API_CONFIG.rateLimit.maxRequests;
    this.timeWindow = API_CONFIG.rateLimit.timeWindow;
    this.minDelay = API_CONFIG.rateLimit.minDelay;
  }

  canMakeRequest() {
    this.cleanup();
    return this.requests.length < this.maxRequests;
  }

  addRequest() {
    this.requests.push(Date.now());
  }

  getWaitTime() {
    this.cleanup();
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const timeSinceOldest = Date.now() - oldestRequest;
      return Math.max(0, this.timeWindow - timeSinceOldest);
    }
    return 0;
  }

  cleanup() {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );
  }

  async waitForSlot() {
    while (!this.canMakeRequest()) {
      const waitTime = this.getWaitTime();
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  getStatus() {
    this.cleanup();
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      timeWindow: this.timeWindow,
      oldestRequest: this.requests[0] ? Date.now() - this.requests[0] : 0,
    };
  }
}

export const rateLimiter = new RateLimiter();
