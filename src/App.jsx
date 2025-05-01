import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./components/nav/Navbar";
import Landing from "./components/main/Landing";
import CoinLists from "./components/main/CoinLists";
import CoinDetail from "./components/coin/CoinDetail";

function App() {
  return (
    <Router>
      <Flex minH="100vh" overflowX="hidden">
        <Navbar />
        <Box
          flex="1"
          ml={{ base: "0", lg: "300px" }}
          p={4}
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
            <Route path="/coin/:coinId" element={<CoinDetail />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
