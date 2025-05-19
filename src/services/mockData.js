// Mock data for development when API limits are reached
const generateMockPriceData = (hours = 24) => {
  console.log("Generating mock price data for", hours, "hours");
  const now = new Date();
  const data = [];
  let basePrice = 50000; // Starting price for BTC
  const volatility = 0.02; // 2% price movement

  for (let i = 0; i < hours; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() - (hours - 1 - i));
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);

    // Generate random price movement
    const change = (Math.random() - 0.5) * volatility;
    basePrice = basePrice * (1 + change);

    data.push({
      date: time,
      price: basePrice,
    });
  }

  // Add the most recent price point with current time
  const latestTime = new Date(now);
  const latestChange = (Math.random() - 0.5) * volatility;
  const latestPrice = basePrice * (1 + latestChange);
  data.push({
    date: latestTime,
    price: latestPrice,
  });

  console.log("Generated", data.length, "data points");
  return data;
};

const mockCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    total_volume: 30000000000,
    high_24h: 51000,
    low_24h: 49000,
    price_change_24h: 1000,
    price_change_percentage_24h: 2.5,
    circulating_supply: 19000000,
    max_supply: 21000000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3000,
    market_cap: 350000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    high_24h: 3100,
    low_24h: 2900,
    price_change_24h: 50,
    price_change_percentage_24h: 1.5,
    circulating_supply: 120000000,
    max_supply: null,
  },
];

export const getMockHistoricalData = (id, timeRange) => {
  console.log("Getting mock historical data for", id, "timeRange:", timeRange);
  // Generate different amounts of data based on timeRange
  const hours =
    timeRange === "1"
      ? 24
      : timeRange === "7"
      ? 24 * 7
      : timeRange === "30"
      ? 24 * 30
      : timeRange === "90"
      ? 24 * 90
      : 24 * 365;

  return generateMockPriceData(hours);
};

export const getMockCoins = () => {
  return mockCoins;
};

export const getMockCoin = (id) => {
  return mockCoins.find((coin) => coin.id === id);
};
