// import CS from "@theme/styles";
import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { palette } from "@theme/themes";

interface Style {
  styleViewItemTitle: ViewStyle;
  styleTextItemTitle: TextStyle;
  styleItemNaviCategory: ViewStyle;
  styleViewIcon: ViewStyle;
  styleTxtTitle: TextStyle;
  styleTxtText: TextStyle;
  styleTxtText2: TextStyle;
  styleListLiveStream: ViewStyle;
  styleTxtTitle1: TextStyle;
  styleItemLiveStream: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    styleTxtText: {
      ...CS.hnLight,
      lineHeight: 16,
      fontSize: 12,
      color: colors.textOpacity4,
    },
    styleTxtText2: {
      ...CS.hnMedium,
      color: colors.textOpacity6,
      lineHeight: 24,
      fontSize: 16,
    },
    styleTxtTitle: {
      ...CS.hnBold,
      lineHeight: 28,
      fontSize: 20,
      color: colors.textOpacity8,
    },
    styleItemNaviCategory: {
      ...CS.flexRear,
      marginHorizontal: 16,
      gap: 8,
      height: 56,
      borderRadius: 8,
      marginTop: 8,
      paddingHorizontal: 16,
    },
    styleViewItemTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: ScreenWidth * 0.8,
      paddingRight: 16,
    },
    styleTextItemTitle: {
      ...CS.hnMedium,
      fontSize: 16,
    },
    styleViewIcon: {
      ...CS.center,
      width: 40,
      height: 40,
      borderRadius: 100,
      backgroundColor: colors.black,
    },
    styleListLiveStream: {
      height: 150,
      backgroundColor: palette.background2,
      borderRadius: 8,
    },
    styleItemLiveStream: {
      position: "absolute",
      bottom: 40,
      paddingHorizontal: 8,
    },
    styleTxtTitle1: {
      ...CS.textOpacity8,
    },
  });
};
