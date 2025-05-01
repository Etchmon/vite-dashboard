import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Spinner, Text } from "@chakra-ui/react";
import { LineChart } from "@mui/x-charts/LineChart";
import { getTopCoins } from "../../services/geckoService";

const timeRanges = {
  "1H": { days: 1 },
  "24H": { days: 1 },
  "7D": { days: 7 },
  "1M": { days: 30 },
  "1Y": { days: 365 },
};

const CryptoChart = () => {
  const [selectedRange, setSelectedRange] = useState("24H");
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getTopCoins();
        setCoins(data);
        setSelectedCoin(data[0]); // Default to the first coin
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (!selectedCoin) return;

    const fetchChartData = async () => {
      setLoading(true);
      try {
        const { sparkline_in_7d } = selectedCoin;
        const { days } = timeRanges[selectedRange];

        // Simulating different ranges using existing 7-day sparkline
        let prices = sparkline_in_7d?.price.slice(-days * 24) || [];
        const formattedData = prices.map((price, index) => ({
          time: index,
          price,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedCoin, selectedRange]);

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
      ) : chartData.length > 0 ? (
        <LineChart
          xAxis={[{ id: "time", dataKey: "time", scaleType: "point" }]}
          series={[
            {
              id: "price",
              dataKey: "price",
              label: "Price (USD)",
              color: "blue",
            },
          ]}
          dataset={chartData}
          width={600}
          height={300}
        />
      ) : (
        <Text color="gray.400">No data available</Text>
      )}
    </Box>
  );
};

export default CryptoChart;
