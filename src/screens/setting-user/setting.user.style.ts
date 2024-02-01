import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  styleItemButtonListSettingUser: ViewStyle;
  styleTextTitle: TextStyle;
  styleTextDetail: TextStyle;
}
export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    styleItemButtonListSettingUser: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      alignItems: "center",
      height: 56,
    },
    styleTextTitle: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
    },
    styleTextDetail: {
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.textOpacity8,
    },
  });
};
