import { SimpleGrid, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getTopCoins } from '../services/geckoService';
import CoinCard from './CoinCard.jsx';

const TopCoinsList = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopCoins();
      setCoins(data);
    };

    fetchData();
  }, []);

  return (
    <SimpleGrid columns={{ base: 1}}>
      {coins.map((coin) => (
        <Box key={coin.id} p={4} boxShadow="md" borderRadius="md" bg="catpuccino.surface1">
          <CoinCard coin={coin} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default TopCoinsList;
