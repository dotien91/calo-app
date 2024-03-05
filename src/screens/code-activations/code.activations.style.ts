import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { palette } from "@theme/themes";

interface Style {
  container: ViewStyle;
  wrapSort: ViewStyle;
  txtCountResult: TextStyle;
  headerText: TextStyle;
  des: TextStyle;
  viewAvatar: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.white,
      paddingBottom: 40,
      ...CS.safeAreaView,
      // padding: 16,
      // paddingTop: getStatusBarHeight()
    },
    viewAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    headerText: {
      ...CS.hnSemiBold,
      color: colors.text,
    },
    des: {
      marginTop: 8,
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
    },
    txtSelect: {
      ...CS.hnBold,
      fontSize: 24,
      color: colors.primary,
    },
    boxFilter: {
      backgroundColor: colors.white,
      marginBottom: 16,
    },
    typeLearningLabel: {
      ...CS.hnSemiBold,
      fontSize: 16,
      marginBottom: 6,
    },
    wrapBtnFilter: {
      ...CS.flexStart,
      paddingLeft: 16,
    },
    btnFilter: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 99,
      backgroundColor: colors.btnInactive,
      marginRight: 8,
      flex: 1,
    },
    txtFilter: {
      ...CS.hnRegular,
      fontSize: 16,
      color: colors.textOpacity6,
    },
    btnFilterActive: {
      backgroundColor: colors.primary,
    },
    txtFilterActive: {
      color: colors.white,
    },
    // box-shadow: 0px 4px 20px 0px #00000008;

    selectView: {
      marginBottom: 16,
      padding: 16,
      paddingTop: 0,
      ...CS.flexRear,
      backgroundColor: colors.white,
      shadowColor: "rgba(0,0,0,0.8)",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,

      elevation: 1,
      shadowRadius: 10,
    },
    boxFilterDetail: {
      height: Device.height - 200,
      padding: 16,
    },
    itemFilterLabel: {
      ...CS.hnSemiBold,
      color: colors.textOpacity8,
      marginBottom: 8,
    },
    wrapSort: {
      ...CS.flexRear,
      padding: 16,
      paddingTop: 4,
    },
    txtCountResult: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 99,
      backgroundColor: colors.grey2,
      ...CS.flexCenter,
    },
    textNoReview: {
      ...CS.hnRegular,
      fontSize: 14,
      colors: colors.textOpacity8,
    },
    viewCustomer: {
      ...CS.row,
      height: 80,
      alignItems: "center",
      justifyContent: "space-between",
      width: ScreenWidth - 32,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      gap: 12,
      backgroundColor: colors.grey3,
      marginTop: 4,
    },
    viewCourse: {
      ...CS.row,
      gap: 8,
      paddingHorizontal: 16,
      justifyContent: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: colors.borderColor1,
    },
    avatarCourse: {
      width: 48,
      height: 48,
      borderRadius: 4,
      backgroundColor: colors.blue,
    },
    txtPriceCourse: {
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.textOpacity6,
    },
    viewPrecentage: {
      ...CS.center,
      width: 55,
    },
    txtPercentage: {
      ...CS.hnRegular,
      color: palette.green2,
    },
    viewSeeAll: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    txtSeeAll: {
      ...CS.hnSemiBold,
      color: colors.primary,
      lineHeight: 24,
      marginBottom: 8,
      marginTop: 4,
    },
  });
};
