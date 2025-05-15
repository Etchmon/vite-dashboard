import { Box, Flex, useColorMode, Button, VStack } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useCoins } from "../../../context/CoinContext";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { coins, loading } = useCoins();

  return (
    <>
      <MobileNav />

      <Box
        as="nav"
        position="fixed"
        top={0}
        left={0}
        w="300px"
        h="100vh"
        bg={colorMode === "light" ? "white" : "gray.800"}
        borderRight="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        display={{ base: "none", lg: "block" }}
      >
        <Flex
          h="16"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          borderBottom="1px"
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        >
          <Button
            as="a"
            href="/"
            variant="ghost"
            fontWeight="bold"
            fontSize="lg"
          >
            Crypto Dashboard
          </Button>
          <Button onClick={toggleColorMode} variant="ghost">
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
        <VStack spacing={4} align="stretch" p={4}>
          <SidebarContent coins={coins} loading={loading} />
        </VStack>
      </Box>
    </>
  );
};

export default Navbar;
