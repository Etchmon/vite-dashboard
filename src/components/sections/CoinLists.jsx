import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchTopCoins } from "../../services/geckoService";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const CoinLists = () => {
  const [coins, setCoins] = useState([]);
  const [volatilityData, setVolatilityData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTopCoins();
        setCoins(data);

        // Fetch volatility data for each coin
        const volatilityPromises = data.slice(0, 20).map(async (coin) => {
          try {
            const response = await axios.get(
              `https://api.coingecko.com/api/v3/coins/${
                coin.id
              }/market_chart?vs_currency=usd&days=7&interval=daily&x_cg_demo_api_key=${
                import.meta.env.VITE_API_KEY
              }`
            );

            const prices = response.data.prices.map(([, price]) => price);
            const priceChanges = prices
              .slice(1)
              .map((price, i) => ((price - prices[i]) / prices[i]) * 100);

            // Calculate standard deviation of price changes
            const mean =
              priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
            const squareDiffs = priceChanges.map((value) =>
              Math.pow(value - mean, 2)
            );
            const avgSquareDiff =
              squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
            const volatility = Math.sqrt(avgSquareDiff);

            return { id: coin.id, volatility };
          } catch (error) {
            console.error(
              `Error fetching volatility data for ${coin.id}:`,
              error
            );
            return { id: coin.id, volatility: 0 };
          }
        });

        const volatilityResults = await Promise.all(volatilityPromises);
        const volatilityMap = volatilityResults.reduce(
          (acc, { id, volatility }) => {
            acc[id] = volatility;
            return acc;
          },
          {}
        );

        setVolatilityData(volatilityMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getTopGainers = () => {
    return [...coins]
      .sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      )
      .slice(0, 5);
  };

  const getTopLosers = () => {
    return [...coins]
      .sort(
        (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
      )
      .slice(0, 5);
  };

  const getMostVolatile = () => {
    return [...coins]
      .filter((coin) => volatilityData[coin.id] !== undefined)
      .sort((a, b) => volatilityData[b.id] - volatilityData[a.id])
      .slice(0, 5);
  };

  const ListItem = ({ coin }) => (
    <Link
      as={RouterLink}
      to={`/coin/${coin.id}`}
      _hover={{ textDecoration: "none" }}
    >
      <Flex
        p={2}
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        justify="space-between"
        align="center"
      >
        <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
        <Text
          color={
            coin.price_change_percentage_24h >= 0 ? "green.500" : "red.500"
          }
        >
          {coin.price_change_percentage_24h.toFixed(2)}%
        </Text>
      </Flex>
    </Link>
  );

  const VolatileListItem = ({ coin }) => (
    <Link
      as={RouterLink}
      to={`/coin/${coin.id}`}
      _hover={{ textDecoration: "none" }}
    >
      <Flex
        p={2}
        borderRadius="md"
        _hover={{ bg: "gray.100" }}
        justify="space-between"
        align="center"
      >
        <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
        <Text color="purple.500">
          {volatilityData[coin.id]?.toFixed(2) || "0.00"}%
        </Text>
      </Flex>
    </Link>
  );

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={8}
      p={4}
      maxW="100%"
    >
      <Box>
        <Heading size="md" mb={2}>
          Top Gainers
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Cryptocurrencies with the highest 24-hour price increase
        </Text>
        <VStack align="stretch" spacing={2}>
          {getTopGainers().map((coin) => (
            <ListItem key={coin.id} coin={coin} />
          ))}
        </VStack>
      </Box>

      <Box>
        <Heading size="md" mb={2}>
          Top Losers
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Cryptocurrencies with the highest 24-hour price decrease
        </Text>
        <VStack align="stretch" spacing={2}>
          {getTopLosers().map((coin) => (
            <ListItem key={coin.id} coin={coin} />
          ))}
        </VStack>
      </Box>

      <Box>
        <Heading size="md" mb={2}>
          Most Volatile (7d)
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Cryptocurrencies with the highest price fluctuation over the past week
        </Text>
        <VStack align="stretch" spacing={2}>
          {getMostVolatile().map((coin) => (
            <VolatileListItem key={coin.id} coin={coin} />
          ))}
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

export default CoinLists;
