import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Navbar from "./components/layout/nav/Navbar";
import Landing from "./components/sections/Landing";
import CoinLists from "./components/sections/CoinLists";
import CoinDetail from "./components/cryptocurrency/CoinDetail";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Router>
      <Flex minH="100vh" overflowX="hidden">
        <Navbar isOpen={isOpen} onClose={onClose} />
        <Box
          flex="1"
          ml={{ base: "0", lg: "300px" }}
          p={{ base: 0, md: 4 }}
          bg="gray.50"
          minH="100vh"
          maxW="100%"
          overflowX="hidden"
        >
          <Routes>
            <Route
              path="/"
              element={
                <Box maxW="100%" overflowX="hidden">
                  <Landing />
                  <CoinLists />
                </Box>
              }
            />
            <Route
              path="/coin/:coinId"
              element={<CoinDetail onOpenNav={onOpen} />}
            />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
