import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Container,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import TickerBar from "../components/layout/ticker/TickerBar";

const Feature = ({ title, description }) => (
  <VStack
    p={6}
    bg="white"
    _dark={{ bg: "gray.800" }}
    rounded="xl"
    shadow="md"
    spacing={4}
    align="start"
  >
    <Heading size="md">{title}</Heading>
    <Text color="gray.600" _dark={{ color: "gray.400" }}>
      {description}
    </Text>
  </VStack>
);

const LandingPage = () => {
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={12} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center" py={12}>
          <Heading
            as="h1"
            size="2xl"
            mb={6}
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
          >
            Crypto Dashboard
          </Heading>
          <Text
            fontSize="xl"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            mb={8}
          >
            Track your favorite cryptocurrencies in real-time with our powerful
            dashboard
          </Text>
          <Button
            as={RouterLink}
            to="/coins"
            size="lg"
            colorScheme="blue"
            px={8}
          >
            Get Started
          </Button>
        </Box>

        {/* Ticker Bar */}
        <TickerBar />

        {/* Features Section */}
        <Box>
          <Heading textAlign="center" mb={12}>
            Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Feature
              title="Real-time Tracking"
              description="Monitor cryptocurrency prices and market trends in real-time with our advanced tracking system."
            />
            <Feature
              title="Detailed Analysis"
              description="Access comprehensive market data, price history, and performance metrics for each cryptocurrency."
            />
            <Feature
              title="Price Alerts"
              description="Set up custom alerts to stay informed about significant price movements in your favorite cryptocurrencies."
            />
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box
          textAlign="center"
          py={12}
          bg="blue.50"
          _dark={{ bg: "blue.900" }}
          rounded="xl"
        >
          <Heading mb={4}>Ready to Start Tracking?</Heading>
          <Text mb={8} color="gray.600" _dark={{ color: "gray.400" }}>
            Explore our comprehensive cryptocurrency dashboard and start
            monitoring your favorite coins today.
          </Text>
          <Button
            as={RouterLink}
            to="/coins"
            size="lg"
            colorScheme="blue"
            px={8}
          >
            View All Coins
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default LandingPage;
