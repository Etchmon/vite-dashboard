import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import BarChartComponent from './charts/BarChart';

function Dashboard() {
  const data = [
    { label: 'January', value: 30 },
    { label: 'February', value: 20 },
    { label: 'March', value: 50 },
    { label: 'April', value: 80 },
  ];
  return (
    <Flex bg="catppuccin.surface0" height="100vh" width="100vw" bg="catppuccin.surface0">
      <Box width="100%" bg="catppuccin.surface0" color="catpuccin.text" p="4" textAlign={['center']}>
        <Grid templateColumns={{ base:'repeat(1, 1fr)', md:'repeat(2, 1fr)'}} gap={6}>
          <GridItem>
            <BarChartComponent data={data}/>
          </GridItem>
          <GridItem>
            <BarChartComponent data={data}/>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
}

export default Dashboard;
