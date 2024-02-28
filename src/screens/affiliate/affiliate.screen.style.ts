import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  container: ViewStyle;
  styleViewTotalAff: ViewStyle;
  styleTotalToday: ViewStyle;
  styleImageBg2: ViewStyle;
  styleViewLine: ViewStyle;
  styleViewTotal: ViewStyle;
  styleButton: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    styleViewTotalAff: {
      flexDirection: "row",
      marginTop: 10,
      marginHorizontal: 16,
    },
    styleTotalToday: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    styleImageBg2: {},
    styleViewLine: {
      flexDirection: "column",
    },
    styleViewTotal: {
      backgroundColor: colors.grey1,
    },
    styleButton: {},
  });
};
