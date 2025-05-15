import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const CoinCard = ({ coin }) => {
  const { colorMode } = useColorMode();
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link
      as={RouterLink}
      to={`/coin/${coin.id}`}
      _hover={{ textDecoration: "none" }}
    >
      <Box
        p={6}
        bg={colorMode === "light" ? "white" : "gray.700"}
        rounded="lg"
        shadow="md"
        _hover={{
          transform: "translateY(-2px)",
          shadow: "lg",
          transition: "all 0.2s",
        }}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center" gap={3}>
            <Image
              src={coin.image}
              alt={coin.name}
              boxSize="32px"
              objectFit="contain"
            />
            <Box>
              <Text fontWeight="bold">{coin.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {coin.symbol.toUpperCase()}
              </Text>
            </Box>
          </Flex>
          <Badge
            colorScheme={isPositive ? "green" : "red"}
            fontSize="sm"
            px={2}
            py={1}
            rounded="md"
          >
            {isPositive ? "+" : ""}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </Badge>
        </Flex>

        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            ${coin.current_price.toLocaleString()}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Market Cap: ${coin.market_cap.toLocaleString()}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default CoinCard;
