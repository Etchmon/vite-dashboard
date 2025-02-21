import { Flex } from "@chakra-ui/react";
import Header from "./../header/Header.jsx";
import TickerBar from "./../ticker/TickerBar.jsx";

function Landing() {
  return (
    <Flex direction={"column"} bg="catppuccin.base">
      <Header />
      <TickerBar />
    </Flex>
  );
}

export default Landing;
