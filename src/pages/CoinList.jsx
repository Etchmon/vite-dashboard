import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  Heading,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { useCoins } from "../context/CoinContext";
import CoinCard from "../components/coin/CoinCard";

const CoinList = () => {
  const { coins, loading } = useCoins();
  const { colorMode } = useColorMode();

  if (loading) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading mb={2}>All Cryptocurrencies</Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Track and analyze the top cryptocurrencies in real-time
        </Text>
      </Box>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={6}
        bg={colorMode === "light" ? "white" : "gray.800"}
        p={6}
        rounded="xl"
        shadow="sm"
      >
        {coins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default CoinList;
