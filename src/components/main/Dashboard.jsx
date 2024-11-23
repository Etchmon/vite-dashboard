import { Box, Flex, Grid } from "@chakra-ui/react";

function Dashboard() {

  return (
    <Flex bg="catppuccin.surface0" height="100vh">
      <Box bg="catppuccin.surface0" color="catpuccin.text" p="4" textAlign={['center']}>
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
        </Grid>
      </Box>
    </Flex>
  );
}

export default Dashboard;
