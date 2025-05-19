import { SimpleGrid, Box, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiService } from "../../../services/apiService";
import CoinCard from "./CoinCard";

const CoinList = ({ onClose }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.fetchTopCoins();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

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
          <CoinCard coin={coin} onClose={onClose} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default CoinList;
