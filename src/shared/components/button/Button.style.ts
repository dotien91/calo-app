import { StyleSheet } from "react-native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export default () => {
  return StyleSheet.create({
    viewButton: {
      paddingVertical: 9,
      borderRadius: 8,
      backgroundColor: palette.mainColor2,
      ...CommonStyle.flexCenter,
      paddingHorizontal: 16,
    },
    textButton: {
      ...CommonStyle.hnSemiBold,
      color: palette.white,
      fontSize: 16,
    },
    pressableBtn: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: palette.mainColor2,
    },
    btnPrimary: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CommonStyle.center,
      backgroundColor: palette.primary,
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
      borderColor: palette.primary,
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
    btnPrimary: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      ...CommonStyle.center,
      backgroundColor: palette.primary,
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
      borderColor: palette.primary,
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
    btnViewmore: {
      backgroundColor: palette.grey1,
    },
  });
};
