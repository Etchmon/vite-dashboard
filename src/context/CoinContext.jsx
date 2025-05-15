import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { fetchTopCoins, fetchCoinMarketChart } from "../services/geckoService";

const CoinContext = createContext();

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

const initialState = {
  coins: [],
  loading: true,
  error: null,
  lastUpdated: null,
  retryCount: 0,
  isInitialized: false,
};

function coinReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        coins: action.payload,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
        retryCount: 0,
        isInitialized: true,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        retryCount: state.retryCount + 1,
      };
    case "RETRY_FETCH":
      return {
        ...state,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}

export function CoinProvider({ children }) {
  const [state, dispatch] = useReducer(coinReducer, initialState);

  const fetchCoins = useCallback(
    async (force = false) => {
      // Don't fetch if we've updated in the last minute unless forced
      if (
        !force &&
        state.lastUpdated &&
        Date.now() - state.lastUpdated < 60000
      ) {
        console.log(
          "Using cached data, last updated:",
          new Date(state.lastUpdated).toLocaleTimeString()
        );
        return;
      }

      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchTopCoins();
        console.log("Fetched top coins:", data.length);

        // Fetch chart data for each coin to calculate consistent price changes
        const chartPromises = data.slice(0, 20).map(async (coin) => {
          try {
            const chartData = await fetchCoinMarketChart(coin.id, 2);
            const changes = calculatePriceChanges(chartData.prices);
            console.log(`Price changes for ${coin.id}:`, changes);
            return {
              ...coin,
              price_change_percentage_24h:
                changes?.change24h || coin.price_change_percentage_24h,
              current_price: changes?.currentPrice || coin.current_price,
            };
          } catch (error) {
            console.error(`Error fetching chart data for ${coin.id}:`, error);
            return coin;
          }
        });

        const coinsWithPriceChanges = await Promise.all(chartPromises);
        console.log("Final coins data:", coinsWithPriceChanges[0]); // Log first coin as example
        dispatch({ type: "FETCH_SUCCESS", payload: coinsWithPriceChanges });
      } catch (error) {
        console.error("Error fetching coins:", error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    },
    [state.lastUpdated]
  );

  // Fetch data on mount
  useEffect(() => {
    if (!state.isInitialized) {
      fetchCoins(true);
    }
  }, [fetchCoins, state.isInitialized]);

  // Retry mechanism with exponential backoff
  useEffect(() => {
    if (state.error && state.retryCount < 3) {
      const timer = setTimeout(() => {
        console.log("Retrying fetch...");
        dispatch({ type: "RETRY_FETCH" });
        fetchCoins(true);
      }, Math.min(1000 * Math.pow(2, state.retryCount), 10000)); // Max 10 second delay

      return () => clearTimeout(timer);
    }
  }, [state.error, state.retryCount, fetchCoins]);

  // Periodic refresh
  useEffect(() => {
    if (state.isInitialized) {
      const timer = setInterval(() => {
        fetchCoins();
      }, 60000); // Refresh every minute

      return () => clearInterval(timer);
    }
  }, [fetchCoins, state.isInitialized]);

  const value = {
    ...state,
    fetchCoins,
  };

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
}

export function useCoins() {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return context;
}
