import CommonStyle from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  container: ViewStyle;
  viewHeader: ViewStyle;
  txtheader: TextStyle;
  buttonBack: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      ...CommonStyle.safeAreaView,
      backgroundColor: colors.background,
    },
    viewHeader: {
      flexDirection: "row",
      height: 40,
      paddingHorizontal: 16,
      gap: 16,
      alignItems: "center",
    },
    txtheader: {
      flex: 1,
      ...CommonStyle.hnSemiBold,
      color: colors.text,
    },
    buttonBack: {
      width: 32,
      height: 32,
      ...CommonStyle.center,
    },
  });
};
