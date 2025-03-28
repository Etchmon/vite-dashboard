// src/services/geckoService.js
const apiKey = import.meta.env.VITE_API_KEY;
const cache = new Map(); // Initialize cache
const cacheKey = "topCoins";
const fetchInterval = 2 * 60 * 1000; // 2 minutes
// const updateInterval = 24 * 60 * 60 * 1000; // 24 hours

export const fetchTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${apiKey}`;

  // Function to fetch data from the API
  try {
    console.log("Fetching top coins from API at", new Date().toISOString());
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    cache.set(cacheKey, data); // Storing the data in the cache
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Initial fetch
fetchTopCoins();

// Set up interval to fetch data every 2 minutes
setInterval(fetchTopCoins, fetchInterval);

// Function checks if the cache is empty or if the data is older than the fetch interval
// If so, it fetches new data from the API
// Otherwise, it returns the cached data
export const getTopCoins = async () => {
  if (cache.has(cacheKey)) {
    console.log("Fetching cached data at:", new Date().toISOString());
    return cache.get(cacheKey); // Retrieving data from cache
  } else {
    return fetchTopCoins();
  }
};

// Function to fetch historical market data for specific coin
