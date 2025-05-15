import {
  Box,
  Flex,
  Button,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useCoins } from "../../context/CoinContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { coins } = useCoins();

  const NavLink = ({ to, children }) => (
    <Link
      as={RouterLink}
      to={to}
      px={4}
      py={2}
      rounded="md"
      _hover={{
        textDecoration: "none",
        bg: colorMode === "light" ? "gray.100" : "gray.700",
      }}
    >
      {children}
    </Link>
  );

  const MobileMenu = () => (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Crypto Dashboard</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <NavLink to="/" onClick={onClose}>
              Home
            </NavLink>
            <NavLink to="/coins" onClick={onClose}>
              All Coins
            </NavLink>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Top Coins
              </Text>
              <VStack align="stretch" spacing={2}>
                {coins.slice(0, 5).map((coin) => (
                  <NavLink
                    key={coin.id}
                    to={`/coin/${coin.id}`}
                    onClick={onClose}
                  >
                    {coin.symbol.toUpperCase()}
                  </NavLink>
                ))}
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={1000}
      bg={colorMode === "light" ? "white" : "gray.800"}
      boxShadow="sm"
    >
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        maxW="container.xl"
        mx="auto"
      >
        <Flex alignItems="center" gap={4}>
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
          />
          <Link
            as={RouterLink}
            to="/"
            fontWeight="bold"
            fontSize="lg"
            _hover={{ textDecoration: "none" }}
          >
            Crypto Dashboard
          </Link>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <Flex display={{ base: "none", md: "flex" }} gap={2}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/coins">All Coins</NavLink>
            <Menu>
              <MenuButton as={Button} variant="ghost">
                Top Coins
              </MenuButton>
              <MenuList>
                {coins.slice(0, 5).map((coin) => (
                  <MenuItem
                    key={coin.id}
                    as={RouterLink}
                    to={`/coin/${coin.id}`}
                  >
                    {coin.symbol.toUpperCase()}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
          <Button onClick={toggleColorMode} variant="ghost">
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
      <MobileMenu />
    </Box>
  );
};

export default Navbar;
