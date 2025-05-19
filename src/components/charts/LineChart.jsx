import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Spinner, Text } from "@chakra-ui/react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiService } from "../../services/apiService";

const timeRanges = {
  "1H": { days: 1 },
  "24H": { days: 1 },
  "7D": { days: 7 },
  "1M": { days: 30 },
  "1Y": { days: 365 },
};

const CryptoChart = ({ coinId, days = 7 }) => {
  const [selectedRange, setSelectedRange] = useState("24H");
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await apiService.fetchTopCoins();
        setCoins(data);
        setSelectedCoin(data[0]); // Default to the first coin
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const chartData = await apiService.fetchCoinMarketChart(coinId, days);
        const formattedData = chartData.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price,
        }));
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchData();
    }
  }, [coinId, days]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box bg="gray.800" p={4} borderRadius="md" shadow="md" maxWidth="700px">
      <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
        {selectedCoin?.symbol.toUpperCase()} Price Chart ({selectedRange})
      </Text>

      {/* Time Range Selector */}
      <ButtonGroup size="sm" isAttached variant="solid" mb={4}>
        {Object.keys(timeRanges).map((range) => (
          <Button
            key={range}
            colorScheme={selectedRange === range ? "blue" : "gray"}
            onClick={() => setSelectedRange(range)}
          >
            {range}
          </Button>
        ))}
      </ButtonGroup>

      {/* Coin Selector */}
      <ButtonGroup size="sm" isAttached variant="outline" mb={4}>
        {coins.slice(0, 5).map((coin) => (
          <Button
            key={coin.id}
            colorScheme={selectedCoin?.id === coin.id ? "blue" : "gray"}
            onClick={() => setSelectedCoin(coin)}
          >
            {coin.symbol.toUpperCase()}
          </Button>
        ))}
      </ButtonGroup>

      {/* Chart or Loading */}
      {loading ? (
        <Spinner size="xl" color="white" />
      ) : data.length > 0 ? (
        <Box height="300px" width="100%">
          <ResponsiveContainer>
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis
                dataKey="date"
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0" }}
              />
              <YAxis
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0" }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2D3748",
                  border: "none",
                  borderRadius: "md",
                }}
                labelStyle={{ color: "#A0AEC0" }}
                formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3182CE"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Text color="gray.400">No data available</Text>
      )}
    </Box>
  );
};

export default CryptoChart;
