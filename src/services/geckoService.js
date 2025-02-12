// src/services/geckoService.js
const apiKey = import.meta.env.VITE_API_KEY;
const cache = new Map();

export const getTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${apiKey}`;

  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     accept: 'application/json',
  //   },
  // };

  // try {
  //   const response = await axios.get(url,options)
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching data:', error.message);
  // }
};
