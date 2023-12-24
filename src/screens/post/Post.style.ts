import { StyleSheet } from "react-native";
import CommonStyle from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";
import { Device } from "utils/helpers/device-ui";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
      paddingTop: getStatusBarHeight(),
      marginBottom: getBottomSpace(),
      paddingBottom: 10,
    },
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
    viewImage: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      paddingHorizontal: 14,
      marginTop: 10,
    },
    viewFile: {
      width: (Device.width - 32 - 30) / 4,
      height: (Device.width - 32 - 30) / 4,
    },
  });
};
export default createStyles;
