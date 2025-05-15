import {
  SimpleGrid,
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useCoinData from "../../hooks/useCoinData";

const CoinList = () => {
  const { data: coins, loading, error, refetch } = useCoinData("topCoins");

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md" m={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!coins?.length) {
    return (
      <Box p={4} textAlign="center">
        <Text>No coins available</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} p={4}>
      {coins.map((coin) => (
        <Link to={`/coin/${coin.id}`} key={coin.id}>
          <Box
            p={4}
            borderRadius="md"
            bg="catpuccino.surface1"
            _hover={{
              transform: "translateY(-2px)",
              transition: "transform 0.2s",
            }}
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {coin.name} ({coin.symbol.toUpperCase()})
              </Text>
              <Text fontSize="xl">${coin.current_price.toLocaleString()}</Text>
              <Text
                color={
                  coin.price_change_percentage_24h >= 0
                    ? "green.500"
                    : "red.500"
                }
                fontWeight="bold"
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </Text>
            </VStack>
          </Box>
        </Link>
      ))}
    </SimpleGrid>
  );
};

export default CoinList;
