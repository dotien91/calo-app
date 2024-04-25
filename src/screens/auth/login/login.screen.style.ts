import { StyleSheet } from "react-native";
import CommonStyle from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
      paddingTop: getStatusBarHeight(),
      marginBottom: getBottomSpace(),
      paddingBottom: 10,
      paddingHorizontal: 20,
    },
    textHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 24,
      color: colors.mainColor2,
      textAlign: "center",
      marginBottom: 18,
    },
    buttonMarginGG: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    buttonMargin: {
      marginVertical: 16,
    },
    textRegister: {
      ...CommonStyle.hnMedium,
      color: colors.mainColor2,
      textAlign: "center",
      marginTop: 16,
    },
  });
};
export default createStyles;
