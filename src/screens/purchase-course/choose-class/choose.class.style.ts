import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
// import { getStatusBarHeight } from "react-native-safearea-height";

interface Style {
  container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      ...CS.safeAreaView,
    },
    classBox: {
      borderRadius: 8,
      shadowColor: "rgba(0,0,0,0.8)",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius: 5,
      marginBottom: 16,
      backgroundColor: colors.white,
      ...CS.borderStyle,
      borderColor: colors.white,
    },
    classBoxDisabled: {
      backgroundColor: colors.btnInactive,
    },
    classBoxActive: {
      borderColor: colors.primary,
    },
    numberWrap: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CS.borderBottomStyle,
    },
    titleClass: {
      ...CS.hnMedium,
      color: colors.text,
      marginBottom: 4,
    },
    calendarWrap: {
      ...CS.center,
      paddingVertical: 8,
    },
    text: {
      ...CS.hnRegular,
      color: colors.textOpacity4,
      fontSize: 14,
    },
    calendarTxt: {
      ...CS.hnRegular,
      color: colors.textOpacity8,
      padding: 8,
      ...CS.borderTopStyle,
    },
    checkbox: {
      position: "absolute",
      right: 8,
      top: 4,
      width: 20,
      height: 20,
      ...CS.borderStyle,
      borderWidth: 2,
      borderRadius: 4,
      ...CS.center,
    },

    btnPurchase: {
      padding: 4,
      borderRadius: 4,
      backgroundColor: colors.primary,
      ...CS.center,
    },
    txtPurchaseBtn: {
      ...CS.hnSemiBold,
      color: palette.white,
    },
    hourActiveBtn: {
      backgroundColor: colors.btnInactive,
    },
  });
};
