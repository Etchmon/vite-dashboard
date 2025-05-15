import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  colors: {
    catppuccin: {
      base: "#1e1e2e",
      text: "#cdd6f4",
      subtext: "#a6adc8",
      overlay: "#6c7086",
      surface: "#313244",
      surface2: "#45475a",
      blue: "#89b4fa",
      red: "#f38ba8",
      green: "#a6e3a1",
      yellow: "#f9e2af",
      purple: "#cba6f7",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "catppuccin.base" : "gray.50",
        color: props.colorMode === "dark" ? "catppuccin.text" : "gray.800",
      },
    }),
  },
});

export default theme;
