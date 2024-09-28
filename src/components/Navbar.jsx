import { Box, Flex, Button, Stack, useDisclosure } from '@chakra-ui/react'

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg="gray.800" p={4}>
      <Flex justify="space-between" align="center">
        <Box color="white" fontSize="lg" fontWeight="bold">My Dashboard</Box>
        <Button
          colorScheme="teal"
          display={['block', 'none']}
          onClick={onToggle}
        >
          Menu
        </Button>
        <Stack
          direction="row"
          spacing={4}
          display={{ base: 'none', md: 'flex'}}
        >
          <Button colorScheme="teal" variant="outline">
            Dashboard
          </Button>
           <Button colorScheme="teal" variant="outline">
            Settings 
          </Button>
          <Button colorScheme="teal" variant="outline">
            Profile 
          </Button>
        </Stack>
      </Flex>
      {isOpen && (
        <Flex direction="column" bg="gray.700" mt={2} display={['flex','none']}>
          <Button colorScheme="teal" mb={2}>Dashboard</Button>
          <Button colorScheme="teal">Settings</Button>
        </Flex>
      )}
    </Box>
  );
}

export default Navbar;
