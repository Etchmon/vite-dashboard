import { Box, Flex, Button, Stack, useDisclosure } from '@chakra-ui/react'
import SidebarContent from './SidebarContent.jsx';

function Navbar() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box>
      {/* Main Container */}
      <Flex>
        {/* Sidebar */}
        <Box
          bg="catppuccin.base"
          pg={4}
          width={{ base: '100%', lg: '300px'}}
          height={{ base: 'auto', lg: '100vh'}}
          position={{ lg: 'fixed'}}
          overflowY={{ lg: 'auto'}}
          display={{ base: isOpen ? 'block' : 'none', lg: 'block'}}
          zIndex={{ base: 'overlay', lg: 'auto' }} 
        >
          <SidebarContent onClose={onClose} />
        </Box>

        { /* Menu Button for Small Screens */}
        <Box 
          display={{ base: 'block', lg: 'none'}}
          position="fixed"
          top="4"
          left="4"
          zIndex="overlay"
        >
          <Button colorScheme="teal" onClick={onToggle}>
            {isOpen ? 'Close' : 'Menu'}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
