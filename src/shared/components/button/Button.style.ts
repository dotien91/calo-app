import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    viewButton: {
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: colors.mainColor2,
      ...CommonStyle.flexCenter,
      paddingHorizontal: 16,
    },
    textButton: {
      ...CommonStyle.hnSemiBold,
      color: colors.white,
      fontSize: 16,
    },
    pressableBtn: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.mainColor2,
    },
    btnPrimary: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CommonStyle.center,
      backgroundColor: colors.primary,
    },
    txtBtnPrimary: {
      ...CommonStyle.hnSemiBold,
      color: palette.white,
    },
    btnOutline: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CommonStyle.center,
      ...CommonStyle.borderStyle,
      borderColor: colors.primary,
      backgroundColor: palette.white,
    },
    txtBtnOutline: {
      ...CommonStyle.hnSemiBold,
      color: palette.primary,
    },
    btnDisabled: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CommonStyle.center,
      backgroundColor: palette.btnInactive,
    },
    txtBtnDisabled: {
      ...CommonStyle.hnSemiBold,
      color: palette.textOpacity4,
    },
  });
};
