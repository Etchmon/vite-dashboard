import {
  Box,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const CoinCard = ({ coin }) => {
  const { name, symbol, current_price, price_change_percentage_24h } = coin;
  return (
    <Box
      p={{ base: "4", lg: "2" }}
      boxShadow="md"
      borderRadius="md"
      bg="catpuccin.surface1"
      color="white"
    >
      <VStack align="start" spacing={3}>
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold">
            {name} ({symbol.toUpperCase()})
          </Text>
          <Text fontSize="md" fontWeight="bold">
            ${current_price.toFixed(2)}
          </Text>
        </HStack>
        <Stat>
          <StatLabel>24h Change</StatLabel>
          <StatNumber
            color={price_change_percentage_24h > 0 ? "green.400" : "red.400"}
          >
            {price_change_percentage_24h.toFixed(2)}%
          </StatNumber>
        </Stat>
      </VStack>
    </Box>
  );
};

export default CoinCard;
