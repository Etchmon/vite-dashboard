import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  useMediaQuery,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useParams } from "react-router-dom";
import axios from "axios";

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

const CoinDetail = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Memoize chart configuration
  const chartConfig = useMemo(
    () => ({
      height: isMobile ? 350 : 400,
      margin: isMobile
        ? { top: 15, right: 20, bottom: 40, left: 40 }
        : { top: 20, right: 20, bottom: 60, left: 60 },
      fontSize: isMobile ? 10 : 12,
      labelFontSize: isMobile ? 12 : 14,
    }),
    [isMobile]
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        if (width > 0) {
          setIsChartReady(true);
        }
      }
    };

    // Initial width check with a small delay to ensure DOM is ready
    setTimeout(updateWidth, 100);

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = `coin-${coinId}-data`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCoinData(data);
            setLoading(false);
            return;
          }
        }

        const apiKey = import.meta.env.VITE_API_KEY;
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`,
          {
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
          }
        );

        if (!response.data?.prices) {
          throw new Error("Invalid data received from API");
        }

        const prices = response.data.prices.map(([timestamp, price]) => ({
          timestamp: new Date(timestamp).toLocaleDateString(),
          price: price,
        }));

        // Cache the data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: prices,
            timestamp: Date.now(),
          })
        );

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

  // Memoize price calculations
  const { currentPrice, priceChange } = useMemo(() => {
    if (!coinData?.length) return { currentPrice: 0, priceChange: 0 };

    const firstPrice = coinData[0].price;
    const lastPrice = coinData[coinData.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
      currentPrice: lastPrice,
      priceChange: change,
    };
  }, [coinData]);

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

  if (!coinData?.length) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">No data available for this coin</Text>
      </Box>
    );
  }

  // Calculate min and max values for y-axis with padding
  const minPrice = Math.min(...coinData.map((d) => d.price));
  const maxPrice = Math.max(...coinData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisPadding = priceRange * 0.1;

  return (
    <Box p={{ base: 0, md: 4 }}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textTransform="capitalize" px={{ base: 4, md: 0 }}>
          {coinId}
        </Heading>

        <HStack justify="space-between" px={{ base: 4, md: 0 }}>
          <Text fontSize="lg" fontWeight="medium">
            Weekly Chart
          </Text>
          <Text
            fontSize="lg"
            fontWeight="medium"
            color={priceChange >= 0 ? "green.500" : "red.500"}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </Text>
        </HStack>

        <Box
          ref={containerRef}
          height={chartConfig.height}
          width="100%"
          position="relative"
          minWidth={isMobile ? "350px" : "800px"}
          maxWidth="100%"
          bg="white"
          borderRadius="md"
          boxShadow="sm"
          overflow="hidden"
        >
          {!isChartReady ? (
            <Center height="100%">
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={coinData}
                margin={chartConfig.margin}
                width={
                  containerRef.current?.getBoundingClientRect().width || 800
                }
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3182CE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="timestamp"
                  angle={45}
                  textAnchor="start"
                  height={60}
                  tick={{ fontSize: chartConfig.fontSize, fill: "#4A5568" }}
                  label={{
                    value: "Date",
                    position: "bottom",
                    offset: 50,
                    fontSize: chartConfig.labelFontSize,
                    fill: "#4A5568",
                  }}
                />
                <YAxis
                  domain={[minPrice - yAxisPadding, maxPrice + yAxisPadding]}
                  tick={{ fontSize: chartConfig.fontSize, fill: "#4A5568" }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  label={{
                    value: "Price (USD)",
                    angle: -90,
                    position: "left",
                    offset: 40,
                    fontSize: chartConfig.labelFontSize,
                    fill: "#4A5568",
                  }}
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
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3182CE"
                  fill="url(#priceGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, fill: "#3182CE" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        <HStack justify="space-between" px={{ base: 4, md: 0 }}>
          <Text>Current Price: ${currentPrice.toFixed(2)}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CoinDetail;
