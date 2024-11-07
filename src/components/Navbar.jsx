import { Box, Flex, Button, Stack, useDisclosure } from '@chakra-ui/react'
import CoinList from './CoinList'

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg="catppuccin.base" p={4} width={{base:'100%', lg:'300px'}} height={{lg:'100vh'}} position={{lg:'fixed'}}>
      <Flex justify="space-between" align="center">
        <Box color="white" fontSize="lg" fontWeight="bold">My Dashboard</Box>
        <Button
          colorScheme="teal"
          display={['block', 'block', 'block', 'none']}
          onClick={onToggle}
        >
          Menu
        </Button>
      </Flex>
      {isOpen && (
        <Flex direction="column" bg="gray.700" mt={2} display={['flex','flex', 'flex', 'none']}>
          <CoinList />
        </Flex>
      )}
    </Box>
  );
}

export default Navbar;
