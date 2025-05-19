import { useEffect, useState, useRef } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { apiService } from "../../../services/apiService";

const TickerBar = () => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.fetchTopCoins();
        setTickers(data.slice(0, 10)); // Show top 10 coins
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || tickers.length === 0) return;

    const scrollWidth = scrollRef.current.scrollWidth / 2; // Divide by 2 since we duplicate the content
    const clientWidth = scrollRef.current.clientWidth;
    const maxScroll = scrollWidth;

    const scroll = () => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        if (newPosition >= maxScroll) {
          // When we reach the end of the first set, instantly jump back to start
          // without animation
          setIsTransitioning(false);
          return 0;
        }
        if (newPosition === 1) {
          // Re-enable transition after the jump
          setIsTransitioning(true);
        }
        return newPosition;
      });
    };

    const scrollInterval = setInterval(scroll, 30); // Adjust speed here

    return () => clearInterval(scrollInterval);
  }, [tickers]);

  if (loading) {
    return (
      <Box bg="gray.800" p={2}>
        <Spinner size="sm" color="white" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="gray.800" p={2}>
        <Text color="red.400">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.800" p={2} overflow="hidden" position="relative">
      <Flex
        ref={scrollRef}
        gap={8}
        style={{
          transform: `translateX(-${scrollPosition}px)`,
          transition: isTransitioning ? "transform 0.03s linear" : "none",
        }}
      >
        {/* First set of tickers */}
        {tickers.map((ticker) => (
          <Flex
            key={`first-${ticker.id}`}
            align="center"
            gap={2}
            whiteSpace="nowrap"
          >
            <Text color="white" fontWeight="bold">
              {ticker.symbol.toUpperCase()}
            </Text>
            <Text
              color={
                ticker.price_change_percentage_24h >= 0
                  ? "green.400"
                  : "red.400"
              }
            >
              ${ticker.current_price.toLocaleString()}
            </Text>
            <Text
              color={
                ticker.price_change_percentage_24h >= 0
                  ? "green.400"
                  : "red.400"
              }
              fontSize="sm"
            >
              {ticker.price_change_percentage_24h >= 0 ? "+" : ""}
              {ticker.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </Flex>
        ))}
        {/* Duplicate set of tickers for seamless loop */}
        {tickers.map((ticker) => (
          <Flex
            key={`second-${ticker.id}`}
            align="center"
            gap={2}
            whiteSpace="nowrap"
          >
            <Text color="white" fontWeight="bold">
              {ticker.symbol.toUpperCase()}
            </Text>
            <Text
              color={
                ticker.price_change_percentage_24h >= 0
                  ? "green.400"
                  : "red.400"
              }
            >
              ${ticker.current_price.toLocaleString()}
            </Text>
            <Text
              color={
                ticker.price_change_percentage_24h >= 0
                  ? "green.400"
                  : "red.400"
              }
              fontSize="sm"
            >
              {ticker.price_change_percentage_24h >= 0 ? "+" : ""}
              {ticker.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default TickerBar;
