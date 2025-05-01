import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
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
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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

        // Calculate price change percentage for each point
        const firstPrice = prices[0].price;
        const priceChanges = prices.map((point) => ({
          ...point,
          priceChange: ((point.price - firstPrice) / firstPrice) * 100,
        }));

        setCoinData(priceChanges);
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

  // Calculate min and max values for y-axis
  const minPrice = Math.min(...coinData.map((d) => d.price));
  const maxPrice = Math.max(...coinData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisPadding = priceRange * 0.1; // 10% padding

  const chartConfig = isMobile
    ? {
        height: 350,
        width: 350,
        margin: { top: 15, right: 40, bottom: 40, left: 40 },
        tickSize: 8,
        fontSize: 10,
        labelFontSize: 12,
      }
    : {
        height: 400,
        width: containerWidth,
        margin: { top: 20, right: 60, bottom: 60, left: 60 },
        tickSize: 10,
        fontSize: 12,
        labelFontSize: 14,
      };

  return (
    <ThemeProvider theme={theme}>
      <Box p={{ base: 0, md: 4 }}>
        <VStack spacing={4} align="stretch">
          <Heading size="lg" textTransform="capitalize" px={{ base: 4, md: 0 }}>
            {coinId}
          </Heading>

          <Box
            ref={containerRef}
            height={chartConfig.height}
            width="100%"
            position="relative"
          >
            <LineChart
              xAxis={[
                {
                  data: coinData.map((d) => d.timestamp),
                  scaleType: "point",
                  label: "Date",
                  tickSize: chartConfig.tickSize,
                  tickLabelStyle: {
                    angle: 45,
                    textAnchor: "start",
                    fontSize: chartConfig.fontSize,
                  },
                  labelStyle: {
                    transform: "translateY(30px)",
                    fontSize: chartConfig.labelFontSize,
                  },
                },
              ]}
              yAxis={[
                {
                  min: minPrice - yAxisPadding,
                  max: maxPrice + yAxisPadding,
                  tickSize: chartConfig.tickSize,
                  valueFormatter: (value) => `$${value.toLocaleString()}`,
                  tickLabelStyle: {
                    fontSize: chartConfig.fontSize,
                  },
                },
                {
                  label: "Price Change (%)",
                  min: Math.min(...coinData.map((d) => d.priceChange)) - 5,
                  max: Math.max(...coinData.map((d) => d.priceChange)) + 5,
                  tickSize: chartConfig.tickSize,
                  valueFormatter: (value) => `${value.toFixed(2)}%`,
                  tickLabelStyle: {
                    fontSize: chartConfig.fontSize,
                  },
                  labelStyle: {
                    transform: "translateX(30px) rotate(90deg)",
                    textAnchor: "middle",
                    fontSize: chartConfig.labelFontSize,
                  },
                },
              ]}
              series={[
                {
                  data: coinData.map((d) => d.price),
                  area: true,
                  color: "#3182CE",
                  label: "Price",
                },
                {
                  data: coinData.map((d) => d.priceChange),
                  color: "#805AD5",
                  label: "Price Change",
                },
              ]}
              margin={chartConfig.margin}
              height={chartConfig.height}
              width={chartConfig.width}
              grid={{ horizontal: true, vertical: true }}
            />
          </Box>

          <HStack justify="space-between" px={{ base: 4, md: 0 }}>
            <Text>
              Current Price: ${coinData[coinData.length - 1].price.toFixed(2)}
            </Text>
            <Text>
              7-Day Change:{" "}
              {coinData[coinData.length - 1].priceChange.toFixed(2)}%
            </Text>
          </HStack>
        </VStack>
      </Box>
    </ThemeProvider>
  );
};

export default CoinDetail;
