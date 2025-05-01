import { Box, Heading, Text, Button, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import TopCoinsList from "../nav/CoinList";

const Header = () => {
  const { onToggle } = useDisclosure();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggle = () => {
    onToggle();
    setShowSidebar(!showSidebar);
  };

  return (
    <Box>
      {/* Mobile Sidebar */}
      <Box
        bg="catppuccin.base"
        p={4}
        width="100%"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        overflowY="auto"
        display={{ base: showSidebar ? "block" : "none", lg: "none" }}
        zIndex="overlay"
      >
        <Box
          color="white"
          fontSize="lg"
          fontWeight="bold"
          p={4}
          textAlign="center"
        >
          Top Crypto Coins
        </Box>
        <Box flex="1" overflowY="auto" pb={20}>
          <TopCoinsList />
        </Box>
        <Box
          position="fixed"
          bottom={0}
          width="100%"
          textAlign="center"
          p={4}
          bg="catppuccin.base"
        >
          <Button colorScheme="red" size="sm" onClick={handleToggle}>
            Close Menu
          </Button>
        </Box>
      </Box>

      {/* Header Content */}
      <Box
        bgImage="url()"
        bgSize="cover"
        bgPosition="center"
        height="30vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="white"
        p={4}
        m={{ base: 0, md: 4 }}
      >
        <Heading as="h1" size="xl" mb={2}>
          Crypto Tracker
        </Heading>
        <Text fontSize="lg" opacity={0.8} mb={4}>
          Track the latest cryptocurrency prices and trends
        </Text>
        <Button
          display={{ base: "block", lg: "none" }}
          colorScheme="blue"
          variant="solid"
          onClick={handleToggle}
          isDisabled={showSidebar}
          mb={4}
          size="md"
          _hover={{
            bg: "blue.400",
            transform: "scale(1.05)",
            transition: "all 0.2s",
          }}
          _active={{
            bg: "blue.500",
          }}
        >
          Top Coins
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
