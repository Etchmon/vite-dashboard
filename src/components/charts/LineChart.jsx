import { Box, useColorModeValue } from "@chakra-ui/react";
import { LineChart } from "@mui/x-charts";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../../theme/muiTheme"; // MUI theme
import catppuccinMocha from "../../theme/colors.js";

const LineChartComponent = ({ data }) => {
  const bgColor = useColorModeValue(
    catppuccinMocha.base,
    catppuccinMocha.overlay0
  );
  const textColor = useColorModeValue(
    catppuccinMocha.text,
    catppuccinMocha.text
  );

  return (
    <Box
      bg={bgColor}
      p={2}
      width={{ base: "100%" }}
      height={{ base: "400px", md: "600px" }}
      borderRadius="md"
      boxShadow="md"
    >
      <ThemeProvider theme={muiTheme}>
        <LineChart
          xAxis={[
            {
              data: data.map((item) => item.price),
              label: "Time",
              scaleType: "time",
            },
          ]}
          series={[
            {
              data: data.map((item) => item.price),
              label: "Price",
              color: catppuccinMocha.lavender,
            },
          ]}
          sx={{
            "& .MuiAxis-root text": { fill: textColor },
          }}
        />
      </ThemeProvider>
    </Box>
  );
};

export default LineChartComponent;
