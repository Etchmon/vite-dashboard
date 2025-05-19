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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useCoins } from "../context/CoinContext";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { apiService } from "../services/apiService";
import ErrorBoundary from "../components/ErrorBoundary";

const CoinDetail = () => {
  const { id } = useParams();
  const { coins, loading } = useCoins();
  const { colorMode } = useColorMode();
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState("1");
  const [chartLoading, setChartLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [coinDetails, setCoinDetails] = useState(null);
  const [error, setError] = useState(null);

  // Memoize the current coin to prevent unnecessary re-renders
  const coin = useMemo(
    () => coins.find((c) => c.id === id) || coinDetails,
    [coins, id, coinDetails]
  );

  // Memoize the price change color
  const isPositive = useMemo(
    () => coin?.price_change_percentage_24h >= 0,
    [coin?.price_change_percentage_24h]
  );

  // Memoize the formatted price
  const formattedPrice = useMemo(
    () => coin?.current_price.toLocaleString(),
    [coin?.current_price]
  );

  // Memoize the formatted market cap
  const formattedMarketCap = useMemo(
    () => coin?.market_cap.toLocaleString(),
    [coin?.market_cap]
  );

  // Memoize the formatted volume
  const formattedVolume = useMemo(
    () => coin?.total_volume.toLocaleString(),
    [coin?.total_volume]
  );

  // Memoize the formatted supply
  const formattedSupply = useMemo(
    () => coin?.circulating_supply.toLocaleString(),
    [coin?.circulating_supply]
  );

  // Memoize the formatted max supply
  const formattedMaxSupply = useMemo(
    () => coin?.max_supply?.toLocaleString() || "∞",
    [coin?.max_supply]
  );

  // Memoize the chart data
  const chartData = useMemo(() => historicalData, [historicalData]);

  // Memoize the price range
  const memoizedPriceRange = useMemo(() => priceRange, [priceRange]);

  // Memoize the chart formatters
  const formatYAxis = useCallback((value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  }, []);

  const formatXAxis = useCallback(
    (date) => {
      if (timeRange === "1") {
        const hasMinutes = date.getMinutes() !== 0;
        const time = date.toLocaleTimeString([], {
          hour: "numeric",
          minute: hasMinutes ? "2-digit" : undefined,
          hour12: true,
        });
        return time.replace(/\s*[AP]M/i, "");
      }
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: timeRange === "7" ? "2-digit" : undefined,
        minute: timeRange === "7" ? "2-digit" : undefined,
        hour12: true,
      });
    },
    [timeRange]
  );

  const formatTooltip = useCallback((value) => {
    return [`$${value.toLocaleString()}`, "Price"];
  }, []);

  const formatTooltipLabel = useCallback(
    (label) => {
      const date = new Date(label);
      if (timeRange === "1") {
        const hasMinutes = date.getMinutes() !== 0;
        return date.toLocaleTimeString([], {
          hour: "numeric",
          minute: hasMinutes ? "2-digit" : undefined,
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
    },
    [timeRange]
  );

  // Fetch coin details if not in the list
  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (!coin) {
        try {
          setError(null);
          const details = await apiService.fetchCoinDetails(id);
          setCoinDetails(details);
        } catch (error) {
          console.error("Error fetching coin details:", error);
          setError(error.message);
        }
      }
    };

    fetchCoinDetails();
  }, [id, coin]);

  // Fetch historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setChartLoading(true);
      try {
        setError(null);
        const data = await apiService.fetchCoinMarketChart(id, timeRange);
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price,
        }));
        setHistoricalData(formattedData);

        const prices = formattedData.map((d) => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const padding = (max - min) * 0.1;
        setPriceRange({
          min: Math.max(0, min - padding),
          max: max + padding,
        });
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setError(error.message);
      }
      setChartLoading(false);
    };

    fetchHistoricalData();
  }, [id, timeRange]);

  if (loading && !coin) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error && !coin) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error Loading Coin
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!coin) {
    return (
      <Box textAlign="center" py={12}>
        <Heading>Coin not found</Heading>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <VStack spacing={8} align="stretch">
        <Box
          bg={colorMode === "light" ? "white" : "gray.800"}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "flex-start" }}
            gap={6}
          >
            <Image
              src={coin.image}
              alt={coin.name}
              boxSize="64px"
              objectFit="contain"
            />
            <Box flex="1">
              <Heading size="lg" mb={2}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </Heading>
              <Text fontSize="2xl" fontWeight="bold" mb={4}>
                ${formattedPrice}
              </Text>
              <Badge
                colorScheme={isPositive ? "green" : "red"}
                fontSize="md"
                px={2}
                py={1}
              >
                {isPositive ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </Badge>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat>
            <StatLabel>Market Cap</StatLabel>
            <StatNumber>${formattedMarketCap}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>24h Volume</StatLabel>
            <StatNumber>${formattedVolume}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Circulating Supply</StatLabel>
            <StatNumber>{formattedSupply}</StatNumber>
            <StatHelpText>Max: {formattedMaxSupply}</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Market Cap Rank</StatLabel>
            <StatNumber>#{coin.market_cap_rank}</StatNumber>
          </Stat>
        </SimpleGrid>

        <Box
          bg={colorMode === "light" ? "white" : "gray.800"}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <Tabs
            variant="enclosed"
            onChange={(index) => setTimeRange(String(index + 1))}
          >
            <TabList>
              <Tab>24h</Tab>
              <Tab>7d</Tab>
              <Tab>30d</Tab>
              <Tab>1y</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {chartLoading ? (
                  <Box textAlign="center" py={12}>
                    <Spinner size="xl" />
                  </Box>
                ) : error ? (
                  <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Error Loading Chart
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">{error}</AlertDescription>
                  </Alert>
                ) : (
                  <Box height="400px">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatXAxis}
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis
                          tickFormatter={formatYAxis}
                          domain={[
                            memoizedPriceRange.min,
                            memoizedPriceRange.max,
                          ]}
                        />
                        <Tooltip
                          formatter={formatTooltip}
                          labelFormatter={formatTooltipLabel}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={isPositive ? "#38A169" : "#E53E3E"}
                          dot={false}
                        />
                        <ReferenceLine
                          y={coin.current_price}
                          stroke="gray"
                          strokeDasharray="3 3"
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
    </ErrorBoundary>
  );
};

export default CoinDetail;
