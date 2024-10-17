// src/services/geckoService.js
import axios from 'axios';

export const getTopCoins = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/list`;
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


