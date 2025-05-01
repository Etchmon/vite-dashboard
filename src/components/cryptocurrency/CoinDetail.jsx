import { Box, Heading, Text, VStack, HStack, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const CoinDetail = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiKey = import.meta.env.VITE_API_KEY;
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily&x_cg_demo_api_key=${apiKey}`
        );

        if (!response.data || !response.data.prices) {
          throw new Error("Invalid data received from API");
        }

        const prices = response.data.prices.map(([timestamp, price]) => ({
          timestamp: new Date(timestamp).toLocaleDateString(),
          price: price,
        }));

        setCoinData(prices);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError(
          err.response?.data?.error ||
            "Failed to fetch coin data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchCoinData();
    }
  }, [coinId]);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!coinData || coinData.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">No data available for this coin</Text>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Heading size="lg" textTransform="capitalize">
            {coinId}
          </Heading>

          <Box height={400}>
            <LineChart
              xAxis={[
                {
                  data: coinData.map((d) => d.timestamp),
                  scaleType: "point",
                },
              ]}
              series={[
                {
                  data: coinData.map((d) => d.price),
                  area: true,
                  color: "#3182CE",
                },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            />
          </Box>

          <HStack justify="space-between">
            <Text>
              Current Price: ${coinData[coinData.length - 1].price.toFixed(2)}
            </Text>
            <Text>
              7-Day Change:{" "}
              {(
                ((coinData[coinData.length - 1].price - coinData[0].price) /
                  coinData[0].price) *
                100
              ).toFixed(2)}
              %
            </Text>
          </HStack>
        </VStack>
      </Box>
    </ThemeProvider>
  );
};

export default CoinDetail;
