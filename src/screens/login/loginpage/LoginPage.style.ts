import { StyleSheet } from "react-native";
import CommonStyle from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    textHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 32,
      color: colors.mainColor2,
      textAlign: "center",
    },
    buttonMarginGG: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    buttonMargin: {
      marginTop: 16,
      paddingHorizontal: 20,
    },
  });
};
export default createStyles;
