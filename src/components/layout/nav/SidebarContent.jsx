import { Box, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import CoinList from "./CoinList";

const SidebarContent = () => {
  return (
    <Box
      bg="catppuccin.base"
      p={4}
      width="100%"
      height="100vh"
      overflowY="auto"
    >
      <ChakraLink
        as={RouterLink}
        to="/"
        color="white"
        fontSize="lg"
        fontWeight="bold"
        p={4}
        textAlign="center"
        display="block"
        _hover={{ textDecoration: "none", opacity: 0.8 }}
      >
        Top Crypto Coins
      </ChakraLink>
      <Box flex="1" overflowY="auto" pb={20}>
        <CoinList />
      </Box>
    </Box>
  );
};

export default SidebarContent;
