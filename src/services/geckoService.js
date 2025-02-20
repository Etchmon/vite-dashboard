// src/services/geckoService.js
const apiKey = import.meta.env.VITE_API_KEY;
const cache = new Map(); // Initialize cache
const cacheKey = "topCoins";
const fetchInterval = 2 * 60 * 1000; // 2 minutes

export const fetchTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${apiKey}`;

  try {
    // Fetch data
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Check if response is ok
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

export const getTopCoins = async () => {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey); // Retrieving data from cache
  } else {
    return fetchTopCoins();
  }
};
