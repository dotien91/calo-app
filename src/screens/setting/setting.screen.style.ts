import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";
import CS from "@theme/styles";

interface Style {
  container: ViewStyle;
  styleItemNaviSetting: ViewStyle;
  styleViewItemTitle: ViewStyle;
  styleTextItemTitle: TextStyle;
  styleButtonEditProfile: ViewStyle;
  styleButtonViewProfile: ViewStyle;
  styleTextEditProfile: TextStyle;
  styleTextViewProfile: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 12,
    },
    styleItemNaviSetting: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      alignItems: "center",
      height: 56,
    },
    styleViewItemTitle: {
      flexDirection: "row",
      justifyContent: "center",
    },
    styleTextItemTitle: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
    },
    styleButtonEditProfile: {
      backgroundColor: colors.red,
      marginRight: 16,
      borderRadius: 8,
    },
    styleButtonViewProfile: {
      backgroundColor: colors.white,
      marginRight: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.red,
    },
    styleTextEditProfile: {
      ...CS.hnSemiBold,
      marginHorizontal: 16,
      marginVertical: 5,
      fontSize: 14,
      color: colors.white,
    },
    styleTextViewProfile: {
      ...CS.hnSemiBold,
      marginHorizontal: 16,
      marginVertical: 5,
      fontSize: 14,
      color: colors.red,
    },
  });
};
