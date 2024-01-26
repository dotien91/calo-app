import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";

interface Style {
  container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.white,
      paddingBottom: 40,
      flex: 1,
      // padding: 16,
      // paddingTop: getStatusBarHeight()
    },
    listData: {},
    ratingBox: {
      ...CS.flexStart,
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
  });
};
