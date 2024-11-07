import { Box, Text, VStack, HStack, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

const CoinCard = {{ coin }} => {
  const { name, symbol, current_price, price_change_percentage_24h } = coin;
  return (
    <Box p={4} boxShadow="md" borderRadius="md" bg="catpuccin.surface1">
    </Box>
  )
}


