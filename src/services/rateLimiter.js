import { RATE_LIMIT } from "../config/api";

class RateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequests = RATE_LIMIT.maxRequests;
    this.timeWindow = RATE_LIMIT.timeWindow;
  }

  canMakeRequest() {
    const now = Date.now();
    // Remove old requests
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow
    );
    return this.requests.length < this.maxRequests;
  }

  addRequest() {
    this.requests.push(Date.now());
  }

  getWaitTime() {
    if (this.canMakeRequest()) return 0;

    const now = Date.now();
    const oldestRequest = this.requests[0];
    return Math.max(0, this.timeWindow - (now - oldestRequest));
  }

  getStatus() {
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      timeWindow: this.timeWindow,
      waitTime: this.getWaitTime(),
    };
  }
}

export const rateLimiter = new RateLimiter();
