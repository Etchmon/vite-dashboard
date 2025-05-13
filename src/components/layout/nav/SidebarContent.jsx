import { Box, Link as ChakraLink, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CoinList from "./CoinList";

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    if (onClose) {
      onClose();
    }
    navigate("/");
  };

  return (
    <Box
      bg="catppuccin.base"
      p={4}
      width="100%"
      height="100vh"
      overflowY="auto"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <ChakraLink
          onClick={handleHeaderClick}
          color="white"
          fontSize="lg"
          fontWeight="bold"
          _hover={{ textDecoration: "none", opacity: 0.8 }}
          cursor="pointer"
        >
          Top Crypto Coins
        </ChakraLink>
        <Button
          colorScheme="red"
          size="sm"
          onClick={onClose}
          display={{ base: "block", lg: "none" }}
        >
          Close Menu
        </Button>
      </Box>
      <Box flex="1" overflowY="auto" pb={20}>
        <CoinList onClose={onClose} />
      </Box>
    </Box>
  );
};

export default SidebarContent;
