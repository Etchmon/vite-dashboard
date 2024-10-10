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
    <Flex height="100%" width="100vw" bg="catppuccin.surface0">
      <Box bg="catppuccin.surface0" color="catpuccin.text" p="4" textAlign={['center']}>
        <Grid templateColumns="repeat(5,1fr) gap={6}">
          <GridItem>
            <BarChartComponent colSpan={2} data={data}/>
          </GridItem>
          <GridItem>
            <BarChartComponent colSpan={2} data={data}/>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
}

export default Dashboard;
