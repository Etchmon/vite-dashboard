// src/services/geckoService.js
import axios from 'axios';

export const getTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`;

  try {
    const response = await axios.get(url);
    return response.data; // Array of top 20 coins
  } catch (error) {
    console.error("Error fetching top coins", error);
    return null;
  }
};

