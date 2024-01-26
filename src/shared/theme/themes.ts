import { Theme } from "@react-navigation/native";

export const palette = {
  primary: "#E14242",
  mainColor2: "#121118",
  secondColor: "#FDEBED",
  error: "#eb032d",
  textInput: "#4f5c61",
  secondary: "#ff6a00",
  background: "#fff",
  background2: "#F0F0F0",
  placeholder: "rgba(22, 28, 36, 0.4)",
  placeholder2: "#737373",
  borderColor2: "#DCDBE2",
  white: "#fff",
  black: "#101214",
  button: "#1c1e21",
  shadow: "#757575",
  text: "#161C24",
  borderColor: "rgba(0, 53, 128, 0.2)",
  borderColorDark: "#333942",
  danger: "rgb(208, 2, 27)",
  title: "rgb(102, 102, 102)",
  separator: "rgb(194, 194, 195)",
  highlight: "rgb(199, 198, 203)",
  blackOverlay: "rgba(0,0,0,0.6)",
  lightOverlay: "rgba(0,0,0,0.2)",
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
  green: "#60d140",
  timeColor: "rgba(22, 28, 36, 0.64)",
  Transparent: "#00000000",
  backgroundMain: "#FA8072",
  // background: "#FA8072",
  textMain: "#FA8072",
  textLight: "#FA8072",
  textDark: "#FA8072",
  textError: "#FA8072",
  textInactive: "#FA8072",
  backgroundTextInput: "#FA8072",
  lightText: "#FA8072",

  btnNegative: "#FA8072",
  btnActive: "#E14242",
  // btnInactive: "#E8EBEF",
  btnLight: "#F5F5F5",
  btnLightSmoke: "#FA8072",

  icon: "#FA8072",
  iconActive: "#FA8072",
  iconInactive: "#FA8072",
  iconLight: "#F3F3F3",
  iconDark: "#FA8072",
  pink: "#ed435c",
  backgroundClose: "#121118",
  baseColor2: "#FA8072",
  grey2: "rgba(240, 243, 246, 1)",
  grey3: "rgba(232, 235, 239, 1)",
  grey1: "#D9D9D9",
  btnInactive: "rgba(0, 53, 128, 0.1)",
  textOpacity8: "rgba(22, 28, 36, 0.8)",
  textOpacity6: "rgba(22, 28, 36, 0.64)",
  textOpacity4: "rgba(22, 28, 36, 0.4)",
  gold: "rgba(255, 163, 71, 1)",
  bgInput: "rgba(232, 235, 239, 1)",
  bgBestSeller: "rgba(255, 237, 237, 1)",
  red: "rgba(252, 53, 53, 1)",
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
    mainColor2: palette.white,
    grey2: palette.white,
  },
};

declare module "@react-navigation/native" {
  export function useTheme(): ExtendedTheme;
}
