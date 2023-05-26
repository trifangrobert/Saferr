import { extendTheme } from "native-base";

const colors = {
  light: {
    primary: "#FFFFFF",
    secondary: "#F9F6F7",
    background: "#FFE8D6",
    text: "#FF971D",
  },
  dark: {
    primary: "#FF6000",
    secondary: "#FFA559",
    background: "#454545",
    text: "#FFE6C7",
  },
};

const themeConfig = {
    useSystemColorMode: false,
    initialColorMode: 'dark',
};

const theme = extendTheme({
  colors,
  config: themeConfig,
});

export { theme };