import { Theme } from "@react-navigation/native";

// Định nghĩa các màu gốc (Base Palette)
export const palette = {
  // --- Brand Colors (CaloSnap) ---
  primary: "#457a08", // Màu xanh nõn chuối (Lime Green)
  primaryDark: "#457a08",
  accent: "#A2E737",
  
  // --- Basic Colors ---
  black: "#000000",
  white: "#FFFFFF",
  transparent: "transparent",
  
  // --- Backgrounds ---
  background: "#FFFFFF",
  background2: "#F0F0F0",
  backgroundBlack: "#000000",
  backgroundDarkCard: "#1C1C1E", // Màu nền card trong Dark Mode
  
  // --- Text Colors ---
  text: "#161C24",
  textSecondary: "#8E8E93",
  placeholder: "rgba(22, 28, 36, 0.4)",
  
  // --- Status / System ---
  error: "#eb032d",
  success: "#2BC456",
  warning: "#FFA347",
  info: "#0a86cf",
  
  // --- Legacy / Misc (Giữ lại để tương thích ngược) ---
  mainColor2: "#121118",
  secondColor: "#FFEDED",
  textInput: "#4f5c61",
  secondary: "#ff6a00",
  placeholder2: "#737373",
  borderColor1: "rgba(0, 53, 128, 0.08)",
  borderColor2: "#DCDBE2",
  white8: "#FFFFFFCE",
  white7: "rgba(255, 255, 255, 0.7)",
  white86: "rgba(255, 255, 255, 0.86)",
  white0: "rgba(255, 255, 255, 0)",
  black6: "#1C253099",
  button: "#1c1e21",
  shadow: "#757575",
  borderColor: "rgba(0, 53, 128, 0.08)",
  borderColorDark: "#333942",
  danger: "rgb(208, 2, 27)",
  title: "rgb(102, 102, 102)",
  separator: "rgb(194, 194, 195)",
  highlight: "rgb(199, 198, 203)",
  blackOverlay: "rgba(0,0,0,0.6)",
  lightOverlay: "rgba(0,0,0,0.2)",
  whiteOverlay: "rgba(255,255,255,0.1)",
  whiteOverlay1: "rgba(255, 255, 255, 1)",
  iconWhite: "#fff",
  iconBlack: "#101214",
  dynamicWhite: "#fff",
  dynamicBlack: "#1c1e21",
  dynamicBackground: "#fff",
  calpyse: "#2b7488",
  grey: "#eceeef",
  blue: "#0a86cf",
  orange: "#ea7a16",
  green: "rgba(43, 196, 86, 1)",
  green2: "#2BC456",
  timeColor: "rgba(22, 28, 36, 0.64)",
  Transparent: "#00000000",
  
  // Các màu cũ đang set hardcode Salmon (#FA8072), 
  // Map lại về Primary mới hoặc màu trung tính để UI không bị đỏ lòe
  backgroundMain: "#A2E737", 
  textMain: "#A2E737",
  textLight: "#8E8E93", 
  textDark: "#000000",
  textError: "#eb032d",
  textInactive: "#8E8E93",
  backgroundTextInput: "#F0F0F0",
  lightText: "#FFFFFF",

  btnNegative: "#FF453A",
  btnActive: "#A2E737",
  btnInactive2: "#E8EBEF",
  btnLight: "#F5F5F5",
  btnLightSmoke: "#FA8072",

  icon: "#161C24",
  iconActive: "#A2E737",
  iconInactive: "#8E8E93",
  iconLight: "#F3F3F3",
  iconDark: "#161C24",
  pink: "#ed435c",
  backgroundClose: "#121118",
  baseColor2: "#A2E737",
  
  // Greys
  grey2: "rgba(240, 243, 246, 1)",
  grey3: "rgba(232, 235, 239, 1)",
  grey1: "rgba(246, 248, 250, 1)",
  grey4: "#F6F8FA",
  grey5: "#EBEBEF",
  grey6: "#F0F3F6",
  
  btnInactive: "rgba(0, 53, 128, 0.1)",
  
  // Text Opacity (Dùng cho Light Mode mặc định)
  textOpacity9: "rgba(22, 28, 36, 0.9)",
  textOpacity8: "rgba(22, 28, 36, 0.8)",
  textOpacity6: "rgba(22, 28, 36, 0.64)",
  textOpacity5: "rgba(22, 28, 36, 0.52)",
  textOpacity24: "rgba(22, 28, 36, 0.24)",
  textOpacity4: "rgba(22, 28, 36, 0.4)",
  textOpacity2: "rgba(22, 28, 36, 0.90)",
  textOpacity0: "rgba(22, 28, 36, 0)",
  
  gold: "#FFD05B",
  bgInput: "rgba(232, 235, 239, 1)",
  bgInput2: "rgba(240, 243, 246, 1)",
  bgBestSeller: "rgba(255, 237, 237, 1)",
  red: "rgba(252, 53, 53, 1)",
  
  // Map màu này về Primary mới để Button trong ProfileScreen đổi sang màu xanh
  btnRedPrimary: "#A2E737", 
  
  link: "#0044CC",
  lightBlue: "rgba(53, 174, 255, 1)",
  backgroundColorGrey: "rgba(246, 248, 250, 1)",
  blueChart: "rgba(53, 174, 255, 1)",
  greenChart: "rgba(43, 196, 86, 1)",
  yellowComment: "rgba(255, 192, 117, 1)",
  boldYellow: "#fca347",
  skyblue: "rgba(214, 248, 255, 1)",
  skin: "rgba(255, 243, 218, 1)",
  greenOpa: "rgba(232, 247, 239, 1)",
  blueBorder: "rgba(53, 174, 255, 1)",
  greenText: "rgba(43, 196, 86, 1)",
  borderInput: "rgba(0, 53, 128, 0.2)",
  backgroundInputLive: "rgba(0,0,0,0.5)",
  backgroundPayment: "rgba(0,0,0,0.03)",
  yellow: "#FFA347",
  yellow20: "#FFA34733",
  backgroundNotification: "#FD7467",
  primarySub: "rgba(241, 144, 144, 1)",
  colorMoney: "#FEAEAE",
  newClass: "#2BC456",
  callGroup: "#0044CC",
  call11: "#FD7467",
  leave: "#E8EBEF",
  greenTh2: "#30AD6A",
  greenTh1: "#5AD693",
  greenTh3: "#2AA764",
  statusBarAudio: "rgba(0, 0, 0, 0.7)",
};

interface ExtendedTheme extends Theme {
  colors: Theme["colors"] & typeof palette;
}

export const LightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    ...palette,
    primary: palette.primary,
    background: palette.background,
    card: palette.white,
    text: palette.black,
    border: palette.borderColor2,
    notification: palette.red,
  },
};

export const DarkTheme: ExtendedTheme = {
  dark: true,
  colors: {
    ...LightTheme.colors,
    // --- Dark Mode Overrides ---
    primary: palette.primary, // Xanh nõn chuối
    background: palette.black, // Nền đen tuyền
    card: palette.backgroundDarkCard, // Card màu xám đậm #1C1C1E
    text: palette.white, // Chữ trắng
    border: palette.borderColorDark,
    notification: palette.btnNegative,

    // Ghi đè các biến cũ để tương thích giao diện Profile
    backgroundColorGrey: palette.backgroundDarkCard, // Các khối màu xám nhạt chuyển thành xám đậm
    mainColor2: palette.white,
    grey2: palette.backgroundDarkCard,
    grey3: "#2C2C2E", // Đường kẻ line
    
    // Xử lý chữ trong Dark Mode
    textOpacity9: palette.white,
    textOpacity8: "rgba(255, 255, 255, 0.8)",
    textOpacity6: "rgba(255, 255, 255, 0.6)",
    textOpacity4: "rgba(255, 255, 255, 0.4)",
    
    // Icon
    icon: palette.white,
    iconWhite: palette.black, // Đảo ngược logic icon
    iconBlack: palette.white,
    
    // Dynamic
    dynamicBackground: palette.dynamicBlack,
    shadow: palette.transparent,
    borderColor: palette.borderColorDark,
    
    // Button
    btnRedPrimary: palette.primary, // Nút vẫn giữ màu xanh chủ đạo
  },
};

declare module "@react-navigation/native" {
  export function useTheme(): ExtendedTheme;
}