import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  useMediaQuery,
  Tabs,
  TabList,
  Tab,
  Heading,
  Button,
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
import { fetchCoinMarketChart } from "../../services/geckoService";

const CoinDetail = ({ onOpenNav }) => {
  const { coinId } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [coinName, setCoinName] = useState("");

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
        setIsChartReady(width > 0);
      }
    };

    // Initial width check
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Set up window resize listener
    window.addEventListener("resize", updateWidth);

    // Force a check after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateWidth, 100);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener("resize", updateWidth);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching data for coin:", coinId);

        const data = await fetchCoinMarketChart(coinId, 7);
        console.log("Received data:", data);

        if (!data?.prices) {
          console.error("Invalid data received:", data);
          throw new Error("Invalid data received from API");
        }

        // Set coin name from the first letter of coinId
        setCoinName(coinId.charAt(0).toUpperCase() + coinId.slice(1));

        const prices = data.prices.map(([timestamp, price]) => ({
          timestamp: new Date(timestamp).toLocaleDateString(),
          time: new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: price,
          rawTimestamp: timestamp,
        }));

        console.log("Processed prices:", prices);
        setChartData(prices);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setError(
          err.message || "Failed to fetch coin data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchData();
    }
  }, [coinId]);

  // Memoize price calculations
  const { currentPrice, priceChange24h, priceChange7d } = useMemo(() => {
    if (!chartData?.length)
      return { currentPrice: 0, priceChange24h: 0, priceChange7d: 0 };

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const lastPrice = chartData[chartData.length - 1].price;
    const firstPrice = chartData[0].price;

    // Find the closest price point to 24h ago
    const price24hAgo = chartData.reduce((closest, current) => {
      const currentDiff = Math.abs(current.rawTimestamp - oneDayAgo);
      const closestDiff = Math.abs(closest.rawTimestamp - oneDayAgo);
      return currentDiff < closestDiff ? current : closest;
    }).price;

    const change24h = ((lastPrice - price24hAgo) / price24hAgo) * 100;
    const change7d = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
      currentPrice: lastPrice,
      priceChange24h: change24h,
      priceChange7d: change7d,
    };
  }, [chartData]);

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (!chartData) return [];

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    return selectedTimeframe === "24h"
      ? chartData.filter((point) => point.rawTimestamp >= oneDayAgo)
      : chartData;
  }, [chartData, selectedTimeframe]);

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

  if (!chartData?.length) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">No data available for this coin</Text>
      </Box>
    );
  }

  // Calculate min and max values for y-axis with padding
  const minPrice = Math.min(...filteredData.map((d) => d.price));
  const maxPrice = Math.max(...filteredData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisPadding = priceRange * 0.1;

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          {isMobile && (
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={onOpenNav}
              size="md"
              _hover={{
                bg: "blue.400",
                transform: "scale(1.05)",
                transition: "all 0.2s",
              }}
              _active={{
                bg: "blue.500",
              }}
            >
              Top Coins
            </Button>
          )}
          <Heading size="lg" textAlign="center" flex="1">
            {coinName} Price Chart
          </Heading>
          {isMobile && <Box w="40px" />} {/* Spacer to balance the layout */}
        </HStack>

        <Box
          ref={containerRef}
          height={chartConfig.height}
          width="100%"
          position="relative"
          minHeight={chartConfig.height}
        >
          {isChartReady && chartData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={chartConfig.margin}>
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3182CE" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#4A5568"
                  opacity={0.2}
                />
                <XAxis
                  dataKey={selectedTimeframe === "24h" ? "time" : "timestamp"}
                  tick={{ fontSize: chartConfig.fontSize, fill: "#4A5568" }}
                  label={{
                    value: selectedTimeframe === "24h" ? "Time" : "Date",
                    position: "bottom",
                    offset: 40,
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
                  labelFormatter={(value) => {
                    const dataPoint = filteredData.find(
                      (d) => d.time === value || d.timestamp === value
                    );
                    if (!dataPoint) return value; // Fallback to the original value if no match found
                    return selectedTimeframe === "24h"
                      ? `${dataPoint.timestamp} ${dataPoint.time}`
                      : dataPoint.timestamp;
                  }}
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
          <HStack spacing={4}>
            <Text color={priceChange24h >= 0 ? "green.500" : "red.500"}>
              24h: {priceChange24h >= 0 ? "+" : ""}
              {priceChange24h.toFixed(2)}%
            </Text>
            <Text color={priceChange7d >= 0 ? "green.500" : "red.500"}>
              7d: {priceChange7d >= 0 ? "+" : ""}
              {priceChange7d.toFixed(2)}%
            </Text>
          </HStack>
        </HStack>

        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          align="center"
          onChange={(index) => setSelectedTimeframe(index === 0 ? "24h" : "7d")}
        >
          <TabList>
            <Tab>24h</Tab>
            <Tab>7d</Tab>
          </TabList>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default CoinDetail;
