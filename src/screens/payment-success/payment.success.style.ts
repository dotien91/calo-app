import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  styleButtonGoMyLearning: ViewStyle;
  styleViewMain: ViewStyle;
  styleTextPaymentSuccess: TextStyle;
  styleTextGomyLearning: TextStyle;
  styleTextWhencomplete: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    styleButtonGoMyLearning: {
      ...CS.center,
      height: 46,
      width: "100%",
      backgroundColor: colors.btnRedPrimary,
      borderRadius: 8,
    },
    styleTextPaymentSuccess: {
      ...CS.hnSemiBold,
      fontSize: 24,
      color: colors.text,
    },
    styleTextGomyLearning: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.white,
    },
    styleTextWhencomplete: {
      ...CS.hnRegular,
      fontSize: 16,
      color: colors.textOpacity8,
      textAlign: "center",
      marginHorizontal: 16,
      marginVertical: 16,
    },
    styleViewMain: {
      flex: 1,
      alignItems: "center",
      padding: 30,
      marginTop: -50,
    },
  });
};
