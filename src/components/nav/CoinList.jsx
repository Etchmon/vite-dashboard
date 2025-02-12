import { SimpleGrid, Box, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getTopCoins } from "../../services/geckoService.js";
import CoinCard from "./CoinCard.jsx";

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopCoins();
        setCoins(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(coins);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error processing your request.
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
