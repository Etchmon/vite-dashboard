import { ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CoinProvider } from "./context/CoinContext";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import CoinList from "./pages/CoinList";
import CoinDetail from "./pages/CoinDetail";
import theme from "./theme";

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CoinProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/coins" element={<CoinList />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
            </Routes>
          </Layout>
        </Router>
      </CoinProvider>
    </>
  );
}

export default App;
