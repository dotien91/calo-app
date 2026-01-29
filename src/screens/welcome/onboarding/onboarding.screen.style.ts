import { palette } from "@theme/themes";

export const createStyles = (isDarkMode: boolean) => {
  const COLORS = {
    bg: isDarkMode ? "#000000" : "#FFFFFF",
    card: isDarkMode ? "#1C1C1E" : "#FFFFFF",
    cardSelected: isDarkMode ? "#2C2C2E" : palette.secondColor,
    border: isDarkMode ? "#333333" : palette.grey1,
    borderSelected: palette.primary,
    text: isDarkMode ? "#FFFFFF" : palette.text,
    subText: isDarkMode ? "#A0A0A0" : palette.textOpacity8,
    primary: palette.primary,
    white: palette.white,
    footerBg: isDarkMode ? "#000000" : "#FFFFFF",
    footerBorder: isDarkMode ? "#333333" : palette.grey1,
    infoCardBg: isDarkMode ? "#1C1C1E" : palette.grey1 + "20",
  };
  return { COLORS };
};
