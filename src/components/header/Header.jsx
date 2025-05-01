import { Box, Heading, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box
      bgImage="url()"
      bgSize="cover"
      bgPosition="center"
      height="30vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color="white"
      p={4}
    >
      <Heading as="h1" size="xl" mb={2}>
        Crypto Tracker
      </Heading>
      <Text fontSize="lg" opacity={0.8}>
        Track the latest cryptocurrency prices and trends
      </Text>
    </Box>
  );
};

export default Header;
