import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  viewItemLeftCodeActive: ViewStyle;
  viewTitleAndNumberCodeActive: ViewStyle;
  textTitleCodeActive: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    viewItemLeftCodeActive: {
      ...CS.center,
      borderRadius: 16,
      height: 32,
      width: 32,
      marginHorizontal: 16,
    },
    viewTitleAndNumberCodeActive: {
      ...CS.row,
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      marginRight: 16,
      borderBottomColor: colors.grey3,
    },
    textTitleCodeActive: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.textOpacity8,
    },
  });
};
