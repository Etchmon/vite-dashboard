import { extendTheme } from "@chakra-ui/react";
import catppuccinColors from "./colors";

const theme = extendTheme({
  styles: {
    global: {
      html: {
        bg: "catppuccin.base",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        minHeight: "100vh",
      },
      body: {
        margin: 0,
        padding: 0,
      },
    },
  },
  colors: {
    catppuccin: catppuccinColors,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      sizes: {
        md: {
          fontSize: "md",
          px: 4,
          py: 2,
        },
      },
      variants: {
        solid: {
          bg: "catppuccin.blue",
          color: "white",
          _hover: { bg: "catppuccin.sapphire" },
        },
        outline: {
          border: "2px solid",
          borderColor: "catppuccin.blue",
          color: "catppuccin.blue",
          bg: "transparent",
          _hover: {
            bg: "catppuccin.sapphire",
            color: "white",
          },
        },
      },
    },
  },
});

export default theme;
