import { Flex } from "@chakra-ui/react";
import Header from "../layout/header/Header";
import TickerBar from "../layout/ticker/TickerBar";

function Landing() {
  return (
    <Flex direction={"column"} bg="catppuccin.base">
      <Header />
      <TickerBar />
    </Flex>
  );
}

export default Landing;
