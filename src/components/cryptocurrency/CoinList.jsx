import { SimpleGrid, Box, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchTopCoins } from "../../services/geckoService";
import CoinCard from "./CoinCard";
import { performanceMonitor } from "../../utils/performance";

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Start measuring the data fetch operation
      performanceMonitor.startMeasure("coinList-fetch");

      try {
        const data = await fetchTopCoins();
        setCoins(data);
      } catch (error) {
        setError(error.message || "Failed to fetch coin data");
      } finally {
        setLoading(false);
        // End measuring and log the duration
        performanceMonitor.endMeasure("coinList-fetch");
      }
    };

    fetchData();
  }, []);

  // Monitor render performance
  useEffect(() => {
    performanceMonitor.startMeasure("coinList-render");
    return () => {
      performanceMonitor.endMeasure("coinList-render");
    };
  }, [coins]); // Only measure when coins data changes

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <SimpleGrid columns={1} spacing={4}>
      {coins.map((coin) => (
        <Box
          key={coin.id}
          p={4}
          boxShadow="md"
          borderRadius="md"
          bg="catpuccino.surface1"
        >
          <CoinCard coin={coin} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default CoinList;
