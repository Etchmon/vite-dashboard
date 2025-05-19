import { useState, useEffect, useCallback, useMemo } from "react";
import { apiService } from "../services/apiService";

const CACHE_DURATION = 60000; // 1 minute
const cache = new Map();

// Helper function to calculate price changes consistently
const calculatePriceChanges = (prices) => {
  if (!prices?.length) return null;

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const lastPrice = prices[prices.length - 1][1];
  const firstPrice = prices[0][1];

  // Find price 24h ago
  const price24hAgo = prices.reduce((closest, current) => {
    const currentDiff = Math.abs(current[0] - oneDayAgo);
    const closestDiff = Math.abs(closest[0] - oneDayAgo);
    return currentDiff < closestDiff ? current : closest;
  })[1];

  return {
    currentPrice: lastPrice,
    change24h: ((lastPrice - price24hAgo) / price24hAgo) * 100,
    change7d: ((lastPrice - firstPrice) / firstPrice) * 100,
  };
};

const useCoinData = (type, params = {}) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  // Memoize the params object to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchData = useCallback(async () => {
    const cacheKey = `${type}-${JSON.stringify(memoizedParams)}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setState({
        data: cached.data,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      let data;
      let chartData;
      let priceChanges;
      let chartPromises;
      let days;

      switch (type) {
        case "topCoins":
          data = await apiService.fetchTopCoins();
          // For top coins, we'll fetch the 24h chart data to calculate consistent price changes
          chartPromises = data.slice(0, 20).map(async (coin) => {
            try {
              // Fetch 2 days of data to ensure we have enough points for accurate 24h calculation
              const chartData = await apiService.fetchCoinMarketChart(
                coin.id,
                2
              );
              const changes = calculatePriceChanges(chartData.prices);
              return {
                ...coin,
                price_change_percentage_24h:
                  changes?.change24h || coin.price_change_percentage_24h,
              };
            } catch (error) {
              console.error(`Error fetching chart data for ${coin.id}:`, error);
              return coin;
            }
          });
          data = await Promise.all(chartPromises);
          break;
        case "coinDetails":
          data = await apiService.fetchCoinDetails(memoizedParams.coinId);
          break;
        case "marketChart":
          // Always fetch at least 2 days of data for accurate 24h calculation
          days = Math.max(memoizedParams.days || 7, 2);
          chartData = await apiService.fetchCoinMarketChart(
            memoizedParams.coinId,
            days
          );
          // Calculate price changes consistently
          priceChanges = calculatePriceChanges(chartData.prices);
          data = {
            ...chartData,
            priceChanges,
          };
          break;
        default:
          throw new Error(`Unknown data type: ${type}`);
      }

      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error.message || "Failed to fetch data",
      });
    }
  }, [type, memoizedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
};

export default useCoinData;
