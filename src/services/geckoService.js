// src/services/geckoService.js
import axios from 'axios';
const apiKey = import.meta.env.VITE_API_KEY;

export const getTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${apiKey}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  try {
    const response = await axios.get(url,options)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};


