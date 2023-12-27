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
    inputDescription: {
      ...CommonStyle.hnRegular,
      flex: 1,
      textAlignVertical: "top",
      paddingHorizontal: 20,
      fontSize: 16,
      width: "100%",
      color: colors.textInput,
    },
    viewContainerLink: {
      flexDirection: "row",
      backgroundColor: colors.background2,
      height: 40,
      alignItems: "center",
      marginHorizontal: 20,
      borderRadius: 20,
    },
    viewIconLink: {
      backgroundColor: colors.borderColor,
      width: 50,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
    },
    textLink: {
      ...CommonStyle.hnLight,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.mainColor2,
      flex: 1,
    },
    category: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    categorySelected: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.highlight,
    },
  });
};
export default createStyles;
