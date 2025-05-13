import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          p={8}
          maxW="container.md"
          mx="auto"
          textAlign="center"
          role="alert"
        >
          <VStack spacing={4}>
            <Heading size="lg" color="red.500">
              Something went wrong
            </Heading>
            <Text>
              We apologize for the inconvenience. Please try refreshing the
              page.
            </Text>
            {process.env.NODE_ENV === "development" && (
              <Box
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="left"
                maxH="200px"
                overflowY="auto"
              >
                <Text fontFamily="mono" fontSize="sm">
                  {this.state.error && this.state.error.toString()}
                </Text>
              </Box>
            )}
            <Button colorScheme="blue" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
