import { Box, Text, Flex, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getTopCoins } from "../../services/geckoService.js";

const TickerBar = () => {
  const [coins, setCoins] = useState([]);
  const [duration, setDuration] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopCoins();
        setCoins(data);

        // Calculate duration based on the number of coins
        const coinCount = data.length;
        setDuration(coinCount * 2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const scroll = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
`;

  return (
    <Box
      width="100%"
      py={2}
      overflow="hidden"
      whiteSpace="nowrap"
      bg="catpuccino.surface1"
    >
      <Flex
        width="fit-content"
        animation={`${scroll} ${duration}s linear infinite`}
      >
        {[...coins, ...coins].map((coin, index) => (
          <Text
            key={`${coin.id}-${index}`}
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
