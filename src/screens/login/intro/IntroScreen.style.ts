import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import { StyleSheet } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
      marginBottom: getBottomSpace(),
      paddingBottom: 10,
    },
    imageStyle: {
      flex: 1,
      width: "100%",
    },
    viewText: {
      alignItems: "center",
      paddingHorizontal: 28,
    },
    textHeader: {
      ...CommonStyle.hnSemiBold,
      marginTop: 32,
      fontSize: 36,
      color: colors.mainColor2,
      textAlign: "center",
    },
    textDescription: {
      ...CommonStyle.hnMedium,
      marginTop: 12,
      fontSize: 18,
      color: colors.mainColor2,
      textAlign: "center",
    },
    styleButton: {
      marginTop: 36,
      paddingHorizontal: 20,
    },
  });
};

export default createStyles;
