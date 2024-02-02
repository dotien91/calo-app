import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  styleItemButtonAboutUs: ViewStyle;
  styleTextTitleItem: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    styleItemButtonAboutUs: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      alignItems: "center",
      height: 56,
    },
    styleTextTitleItem: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
    },
  });
};
