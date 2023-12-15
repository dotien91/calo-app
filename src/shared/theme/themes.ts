import { Theme } from "@react-navigation/native";

export const palette = {
  primary: "#ed282a",
  error: "#eb032d",
  textInput: "#4f5c61",
  secondary: "#ff6a00",
  background: "#fff",
  white: "#fff",
  black: "#101214",
  button: "#1c1e21",
  shadow: "#757575",
  text: "#30363b",
  borderColor: "#999a9a",
  borderColorDark: "#333942",
  placeholder: "#a1a1a1",
  danger: "rgb(208, 2, 27)",
  title: "rgb(102, 102, 102)",
  separator: "rgb(194, 194, 195)",
  highlight: "rgb(199, 198, 203)",
  blackOverlay: "rgba(0,0,0,0.6)",
  iconWhite: "#fff",
  iconBlack: "#101214",
  dynamicWhite: "#fff",
  dynamicBlack: "#1c1e21",
  dynamicBackground: "#fff",
  transparent: "transparent",
  calpyse: "#2b7488",
  grey: "#eceeef",
  blue: "#0a86cf",
  orange: "#ea7a16",
};

interface ExtendedTheme extends Theme {
  colors: Theme["colors"] & typeof palette;
}

export const LightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    ...palette,
  },
};

export const DarkTheme: ExtendedTheme = {
  dark: true,
  colors: {
    ...LightTheme.colors,
    background: palette.black,
    foreground: palette.white,
    text: palette.white,
    tabBar: palette.black,
    iconWhite: palette.black,
    iconBlack: palette.white,
    dynamicBackground: palette.dynamicBlack,
    shadow: palette.transparent,
    borderColor: palette.borderColorDark,
  },
};

declare module "@react-navigation/native" {
  export function useTheme(): ExtendedTheme;
}
