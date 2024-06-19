import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";
import { getStatusBarHeight } from "react-native-safearea-height";
import { Device, isAndroid } from "@utils/device.ui.utils";

interface Style {
  container: ViewStyle;
  viewHeaderContainer: ViewStyle;
  viewHeader: ViewStyle;
  textMoneyHeader: ViewStyle;
  textHeader: TextStyle;
  styleViewTotalAff: ViewStyle;
  styleTotalToday: ViewStyle;
  txtToday: TextStyle;
  txtCommissionToday: TextStyle;
  styleViewLine: ViewStyle;
  bgStatistical: ViewStyle;
  textDisplayName: TextStyle;
  viewAvatar: ViewStyle;
  viewProfileBtn: ViewStyle;
  boxLevel: ViewStyle;
  textLevel: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      // paddingTop: getStatusBarHeight(),
      backgroundColor: colors.white,
      width: Device.width,
    },
    viewHeaderContainer: {
      backgroundColor: colors.greenTh1,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      marginBottom: 5,
    },
    viewHeader: {
      ...CS.row,
      justifyContent: "center",
      alignItems: "center",
      marginTop: isAndroid ? getStatusBarHeight() : 10,
    },
    textMoneyHeader: {
      marginTop: 8,
      marginBottom: 12,
    },
    textHeader: {
      ...CS.hnRegular,
      color: colors.white,
      marginTop: 20,
    },
    styleViewTotalAff: {
      flexDirection: "row",
      marginHorizontal: 16,
      gap: 8,
      marginBottom: 20,
    },
    styleTotalToday: {
      flexDirection: "column",
      alignItems: "flex-end",
      flex: 1,
      marginRight: 6,
    },
    txtToday: {
      ...CS.hnBold,
      fontSize: 12,
      color: colors.white,
      marginTop: 15,
    },
    txtCommissionToday: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.white,
      marginTop: 4,
    },
    styleViewLine: {
      flex: 1,
      height: "100%",
      gap: 12,
    },
    bgStatistical: {
      height: 156,
      width: 165,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.greenTh2,
    },
    textDisplayName: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
      paddingBottom: 5,
    },
    viewAvatar: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginTop: 8,
    },
    viewProfileBtn: {
      backgroundColor: colors.black,
      height: 29,
      width: 90,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    boxLevel: {
      backgroundColor: colors.btnRedPrimary,
      maxWidth: 70,
      textAlign: "center",
      color: colors.white,
      paddingVertical: 2,
      borderRadius: 4,
      paddingHorizontal: 4,
    },
    textLevel: {
      textAlign: "center",
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.white,
    },
  });
};
