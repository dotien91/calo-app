import { palette } from "@theme/themes";

export const createStyles = (isLightMode: boolean) => {
  const COLORS = {
    bg: isLightMode ? "#FFFFFF" : "#000000",
    card: isLightMode ? "#FFFFFF" : "#1C1C1E",
    cardSelected: isLightMode ? palette.secondColor : "#2C2C2E",
    border: isLightMode ? palette.grey1 : "#333333",
    borderSelected: palette.primary,
    text: isLightMode ? palette.text : "#FFFFFF",
    subText: isLightMode ? palette.textOpacity8 : "#A0A0A0",
    primary: palette.primary,
    white: palette.white,
    footerBg: isLightMode ? "#FFFFFF" : "#000000",
    footerBorder: isLightMode ? palette.grey1 : "#333333",
    infoCardBg: isLightMode ? palette.grey1 + "20" : "#1C1C1E",
  };
  return { COLORS };
};
