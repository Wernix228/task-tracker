import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  components: {
    Button: {
      defaultProps: {
        colorScheme: "blue",
      },
    },
  },
});

export default theme; 