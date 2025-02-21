import { Box, Text, Flex, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getTopCoins } from "../../services/geckoService.js";

const scroll = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
`;

const TickerBar = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopCoins();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      width="100%"
      py={2}
      overflow="hidden"
      whiteSpace="nowrap"
      bg="catpuccino.surface1"
    >
      <Flex animation={`${scroll} 12s linear infinite`}>
        {coins.map((coin) => (
          <Text
            key={coin.id}
            p={4}
            color={
              coin.price_change_percentage_24h >= 0 ? "green.500" : "red.500"
            }
            fontSize="lg"
            fontWeight="semibold"
          >
            {coin.symbol.toUpperCase()} (
            {coin.price_change_percentage_24h.toFixed(2)}%)
          </Text>
        ))}
      </Flex>
    </Box>
  );
};

export default TickerBar;
