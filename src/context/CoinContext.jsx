import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { apiService } from "../services/apiService";

const CoinContext = createContext();

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
    case "UPDATE_COIN":
      return {
        ...state,
        coins: state.coins.map((coin) =>
          coin.id === action.payload.id
            ? { ...coin, ...action.payload.updates }
            : coin
        ),
        lastUpdated: Date.now(),
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

  const fetchCoins = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const data = await apiService.fetchTopCoins();
      console.log("Fetched coins data:", data);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching coins:", error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    if (!state.isInitialized) {
      fetchCoins();
    }
  }, [fetchCoins, state.isInitialized]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      fetchCoins,
      updateCoin: (id, updates) =>
        dispatch({ type: "UPDATE_COIN", payload: { id, updates } }),
    }),
    [state, fetchCoins]
  );

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
}

export function useCoins() {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return context;
}
