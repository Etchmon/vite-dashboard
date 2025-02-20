import { Box, Heading } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box
      bgImage="url()"
      bgSize="cover"
      bgPosition="center"
      height="300px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
    >
      <Heading as="h1" size="2xl">
        Crypto Tracker
      </Heading>
    </Box>
  );
};

export default Header;
