import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  useColorMode,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useCoins } from "../context/CoinContext";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CoinDetail = () => {
  const { id } = useParams();
  const { coins, loading } = useCoins();
  const { colorMode } = useColorMode();
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState("1");
  const [chartLoading, setChartLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setChartLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${timeRange}`
        );
        const data = await response.json();

        let formattedData;
        if (timeRange === "1") {
          // Get the most recent price point
          const latestPrice = data.prices[data.prices.length - 1];
          const latestTime = new Date(latestPrice[0]);

          // Create array of last 24 hours, starting from the most recent time
          const hours = Array.from({ length: 24 }, (_, i) => {
            const hour = new Date(latestTime);
            hour.setHours(latestTime.getHours() - i);
            hour.setMinutes(0);
            hour.setSeconds(0);
            hour.setMilliseconds(0);
            return hour;
          }).reverse();

          // Add the most recent price point with exact time
          hours.push(latestTime);

          // For each hour, find the closest price point
          formattedData = hours
            .map((hour) => {
              const timestamp = hour.getTime();
              // Find the closest price point that's not in the future
              const validPrices = data.prices.filter((p) => p[0] <= timestamp);
              if (validPrices.length === 0) return null;

              const closestPrice = validPrices.reduce((prev, curr) => {
                return Math.abs(curr[0] - timestamp) <
                  Math.abs(prev[0] - timestamp)
                  ? curr
                  : prev;
              });

              return {
                date: hour,
                price: closestPrice[1],
              };
            })
            .filter(Boolean); // Remove any null entries
        } else {
          formattedData = data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price: price,
          }));
        }

        setHistoricalData(formattedData);

        // Calculate price range for Y-axis
        const prices = formattedData.map((d) => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const padding = (max - min) * 0.1; // Add 10% padding
        setPriceRange({
          min: Math.max(0, min - padding),
          max: max + padding,
        });
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
      setChartLoading(false);
    };

    fetchHistoricalData();
  }, [id, timeRange]);

  if (loading) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const coin = coins.find((c) => c.id === id);

  if (!coin) {
    return (
      <Box textAlign="center" py={12}>
        <Heading>Coin not found</Heading>
      </Box>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  // Custom Y-axis tick formatter
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  // Custom X-axis tick formatter
  const formatXAxis = (date) => {
    if (timeRange === "1") {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: timeRange === "7" ? "2-digit" : undefined,
      minute: timeRange === "7" ? "2-digit" : undefined,
      hour12: true,
    });
  };

  // Custom tooltip formatter
  const formatTooltip = (value) => {
    return [`$${value.toLocaleString()}`, "Price"];
  };

  const formatTooltipLabel = (label) => {
    const date = new Date(label);
    if (timeRange === "1") {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: timeRange === "7" ? "2-digit" : undefined,
      minute: timeRange === "7" ? "2-digit" : undefined,
      hour12: true,
    });
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box
        bg={colorMode === "light" ? "white" : "gray.800"}
        p={6}
        rounded="xl"
        shadow="sm"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Flex align="center" gap={4} mb={4}>
              <Image
                src={coin.image}
                alt={coin.name}
                boxSize="48px"
                objectFit="contain"
              />
              <Box>
                <Heading size="lg">{coin.name}</Heading>
                <Text color="gray.500">{coin.symbol.toUpperCase()}</Text>
              </Box>
            </Flex>
            <Badge
              colorScheme={isPositive ? "green" : "red"}
              fontSize="md"
              px={3}
              py={1}
              rounded="md"
            >
              {isPositive ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </Badge>
          </Box>

          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <StatLabel>Current Price</StatLabel>
              <StatNumber>${coin.current_price.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Market Cap</StatLabel>
              <StatNumber>${coin.market_cap.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>24h Volume</StatLabel>
              <StatNumber>${coin.total_volume.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Circulating Supply</StatLabel>
              <StatNumber>
                {coin.circulating_supply.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                Max: {coin.max_supply?.toLocaleString() || "∞"}
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </SimpleGrid>
      </Box>

      {/* Price Chart Section */}
      <Box
        bg={colorMode === "light" ? "white" : "gray.800"}
        p={6}
        rounded="xl"
        shadow="sm"
      >
        <Tabs
          onChange={(index) =>
            setTimeRange(["1", "7", "30", "90", "365"][index])
          }
        >
          <TabList>
            <Tab>24h</Tab>
            <Tab>7d</Tab>
            <Tab>30d</Tab>
            <Tab>90d</Tab>
            <Tab>1y</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {chartLoading ? (
                <Box textAlign="center" py={12}>
                  <Spinner size="xl" />
                </Box>
              ) : (
                <Box h="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={colorMode === "light" ? "#E2E8F0" : "#2D3748"}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        stroke={colorMode === "light" ? "#4A5568" : "#A0AEC0"}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        domain={[priceRange.min, priceRange.max]}
                        tickFormatter={formatYAxis}
                        stroke={colorMode === "light" ? "#4A5568" : "#A0AEC0"}
                      />
                      <Tooltip
                        formatter={formatTooltip}
                        labelFormatter={formatTooltipLabel}
                        contentStyle={{
                          backgroundColor:
                            colorMode === "light" ? "white" : "#2D3748",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <ReferenceLine
                        y={coin.current_price}
                        stroke={colorMode === "light" ? "#3182CE" : "#63B3ED"}
                        strokeDasharray="3 3"
                        label={{
                          value: "Current Price",
                          position: "right",
                          fill: colorMode === "light" ? "#4A5568" : "#A0AEC0",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={colorMode === "light" ? "#3182CE" : "#63B3ED"}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: colorMode === "light" ? "#3182CE" : "#63B3ED",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
};

export default CoinDetail;
