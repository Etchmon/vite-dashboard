import { Box, Flex, Heading, Text } from "@chakra-ui/react";

function Dashboard() {
  return (
    <Flex height="100vh">
      <Box width="250px" bg="catppuccin.surface0" color="catpuccin.text" p="4">
        <Heading size="md" mb="4">Sidebar</Heading>
        <Text>Some content</Text>
      </Box>
    </Flex>
  );
}

export default Dashboard;
