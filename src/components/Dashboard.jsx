import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

function Dashboard() {
  return (
    <Flex height="100vh">
      <Box width="100vw" bg="catppuccin.surface0" color="catpuccin.text" p="4" textAlign={['center']}>
        <Grid templateColumns="repeat(3,1fr) gap={6}">
          <GridItem w="100%" h="400px" bg="catppuccin.surface1">
            /* Graph */
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
}

export default Dashboard;
