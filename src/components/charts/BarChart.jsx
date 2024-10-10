// src/components/BarChart.js
import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { BarChart } from '@mui/x-charts';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from '../../theme/muiTheme'; // MUI theme
import catppuccinMocha from '../../theme/colors.js';

const BarChartComponent = ({ data }) => {
  const bgColor = useColorModeValue(catppuccinMocha.base, catppuccinMocha.overlay0);
  const textColor = useColorModeValue(catppuccinMocha.text, catppuccinMocha.text);

  return (
    <Box width="100%" height={{ base: '300px', md: '500px'}} overflow="auto" bg={bgColor} p={4} borderRadius="md" boxShadow="md">
      <ThemeProvider theme={muiTheme}>
        <BarChart
          xAxis={[
            {
              data: data.map((item) => item.label),
              label: "Categories",
              scaleType: "band",
            }
          ]}
          series={[
            {
              data: data.map((item) => item.value),
              label: "Values",
              color: catppuccinMocha.lavender, // Bar color
            }
          ]}
          sx={{
            '& .MuiAxis-root text': { fill: textColor }, // Set axis label color
          }}
        />
      </ThemeProvider>
    </Box>
  );
};

export default BarChartComponent;

