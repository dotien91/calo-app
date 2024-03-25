import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

import CS from "@theme/styles";

interface Style {
  container: ViewStyle;
  label: TextStyle;
  text: TextStyle;
  textSelected: TextStyle;
  des: TextStyle;
  durationBtn: ViewStyle;
  durationBtnSelected: ViewStyle;
  hourBtn: ViewStyle;
  txtBtn: TextStyle;
  txtBtnSelected: TextStyle;
  selectBox: ViewStyle;
  checkbox: ViewStyle;
  checkBoxDisable: ViewStyle;
  checkBoxActive: ViewStyle;
  paddingBtn: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      marginTop: 12,
    },
    label: {
      ...CS.hnMedium,
      color: colors.text,
      marginBottom: 8,
    },
    text: {
      ...CS.hnRegular,
      color: colors.text,
      lineHeight: 24,
    },
    textSelected: {
      ...CS.hnRegular,
      color: colors.white,
      lineHeight: 24,
    },
    des: {
      ...CS.hnRegular,
      color: colors.textOpacity8,
      marginBottom: 4,
    },
    durationBtn: {
      padding: 4,
      flex: 1,
      backgroundColor: colors.grey3,
      marginHorizontal: 4,
      ...CS.flexCenter,
      borderRadius: 4,
    },
    durationBtnSelected: {
      padding: 4,
      flex: 1,
      backgroundColor: colors.primary,
      marginHorizontal: 4,
      ...CS.flexCenter,
      borderRadius: 4,
    },
    hourBtn: {
      shadowColor: "rgba(0,0,0,0.8)",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius: 5,
      marginBottom: 8,
      ...CS.center,
      backgroundColor: colors.white,
      borderRadius: 4,
      paddingVertical: 2,
    },
    txtBtn: {
      ...CS.hnSemiBold,
      color: colors.textOpacity6,
    },
    txtBtnSelected: {
      ...CS.hnSemiBold,
      color: colors.white,
    },
    selectBox: {
      marginBottom: 16,
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
    checkBoxDisable: {
      backgroundColor: colors.btnInactive,
    },
    checkBoxActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    btnPurchase: {
      padding: 4,
      borderRadius: 4,
      backgroundColor: colors.primary,
      ...CS.center,
    },
    txtPurchaseBtn: {
      ...CS.hnSemiBold,
      color: colors.white,
    },
    hourActiveBtn: {
      backgroundColor: colors.btnInactive,
    },
    paddingBtn: {
      marginHorizontal: 16,
      marginTop: 8,
    },
  });
};
