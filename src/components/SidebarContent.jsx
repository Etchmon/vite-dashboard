import { VStack, Box, Text } from '@chakra-ui/react';
import TopCoinsList from './CoinList';

function SidebarContent({ onClose}) {
  return (
    <VStack align="start" spacing={4}>
      { /* Sidebar Header */}
      <Box colorj="white" fontSize="lg" fontWeight="bold">
        Top Crypto Coins
      </Box>
      
      {/* Nav Items */}

      {/* Top Coins List */}
      <TopCoinsList />

      {/* Temp Close Button */}
      <Box display={{base:'block', lg: 'none'}}>
        <Text
          as="button"
          color="red.500"
          onClick={onClose}
          fontWeight="bold"
          fontSize="sm"
        >
          X
        </Text>
      </Box>
    </VStack>
  );
}

export default SidebarContent;
