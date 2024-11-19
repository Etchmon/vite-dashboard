import { SimpleGrid, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getTopCoins } from '../../services/geckoService.js';
import CoinCard from './CoinCard.jsx';

const CoinList = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopCoins();
      setCoins(data);
    };

    fetchData();
  }, []);

  console.log(coins)
  return (
    <SimpleGrid columns={1} spacing={4}>
      {coins.map((coin) => (
        <Box key={coin.id} p={4} boxShadow="md" borderRadius="md" bg="catpuccino.surface1">
          <CoinCard coin={coin} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default CoinList;
