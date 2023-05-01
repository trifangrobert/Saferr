import { extendTheme } from "native-base";

const colors = {
  light: {
    primary: "#1a237e",
    secondary: "#bdbdbd",
    background: "#ffffff",
    text: "#333333",
  },
  dark: {
    primary: "#1a237e",
    secondary: "#bdbdbd",
    background: "#333333",
    text: "#ffffff",
  },
};

const themeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  config: themeConfig,
});

export { theme };