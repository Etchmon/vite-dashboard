// src/services/geckoService.js

import { API_CONFIG } from "../config/api";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// Request queue for rate limiting
const queue = [];
let processing = false;

const processQueue = async () => {
  if (processing || queue.length === 0) return;
  processing = true;

  const { request, resolve, reject } = queue.shift();
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${request.endpoint}`, {
      headers: API_CONFIG.headers,
      ...request.options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (request.cacheKey) {
      cache.set(request.cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    resolve(data);
  } catch (error) {
    reject(error);
  } finally {
    processing = false;
    processQueue();
  }
};

const request = (endpoint, options = {}, cacheKey = null) => {
  // Check cache first
  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.resolve(cached.data);
    }
  }

  // Add to queue
  return new Promise((resolve, reject) => {
    queue.push({ request: { endpoint, options, cacheKey }, resolve, reject });
    processQueue();
  });
};

// API endpoints
export const fetchTopCoins = () =>
  request(
    "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
    {},
    "top_coins"
  );

export const fetchCoinDetails = (coinId) =>
  request(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    {},
    `coin_${coinId}`
  );

export const fetchCoinMarketChart = (coinId, days = 7) =>
  request(
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    {},
    `chart_${coinId}_${days}`
  );

// Get service status
export const getServiceStatus = () => ({
  queueLength: queue.length,
  cacheSize: cache.size,
  isProcessing: processing,
});
