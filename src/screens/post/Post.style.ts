import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";

import CommonStyle from "@theme/styles";
import { Device } from "@utils/device.ui.utils";

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
      ...CommonStyle.flex1,
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
      ...CommonStyle.center,
      borderRadius: 20,
    },
    textLink: {
      ...CommonStyle.hnLight,
      ...CommonStyle.flex1,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.mainColor2,
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
    containerPostDetail: {
      ...CommonStyle.safeAreaView,
      backgroundColor: colors.background2,
    },
    viewCommentPostDetail: {
      marginHorizontal: 20,
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      backgroundColor: colors.background,
      maxHeight: 120,
      marginVertical: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 10,
    },
    buttonFlagPostDetail: {
      height: 25,
      marginTop: 20,
      flexDirection: "row",
      color: colors.highlight,
      alignItems: "center",
    },
    textButtonPostDetail: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      color: colors.text,
      paddingLeft: 18,
    },
    viewInput: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginHorizontal: 16,
      height: 40,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    viewButton: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginHorizontal: 16,
      marginTop: 8,
      gap: 8,
    },
    btnCancel: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.background2,
      padding: 8,
    },
    txtCancel: {
      color: colors.mainColor2,
    },
    btnUpdateDisable: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.mainColor2,
      padding: 8,
    },
    btnUpdate: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.primary,
      padding: 8,
    },
  });
};
export default createStyles;
