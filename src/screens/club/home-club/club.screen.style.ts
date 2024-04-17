import CS from "@theme/styles";
// import { ExtendedTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  styleItem: ViewStyle;
  viewTabBar: ViewStyle;
  txtTabBarForcusd: TextStyle;
  txtTabBar: TextStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    styleItem: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    viewTabBar: {
      backgroundColor: palette.background,
    },
    txtTabBarForcusd: {
      ...CS.hnBold,
      fontSize: 14,
      color: palette.primary,
    },
    txtTabBar: {
      ...CS.hnBold,
      fontSize: 14,
      color: palette.textOpacity6,
    },
    wrapBtnFilter: {
      ...CS.flexStart,
      paddingLeft: 16,
      marginTop: 16,
    },
    btnFilter: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 99,
      backgroundColor: palette.btnInactive,
      marginRight: 8,
      flex: 1,
    },
    txtFilter: {
      ...CS.hnRegular,
      fontSize: 16,
      color: palette.textOpacity6,
    },
    btnFilterActive: {
      backgroundColor: palette.primary,
    },
    txtFilterActive: {
      color: palette.white,
    },
  });
};
