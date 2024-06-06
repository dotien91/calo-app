import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle, StatusBar } from "react-native";

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
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
      backgroundColor: colors.white,
    },
    viewHeaderContainer: {
      backgroundColor: colors.greenTh1,
      borderBottomEndRadius: 10,
      borderBottomStartRadius: 10,
      marginBottom: 5,
    },
    viewHeader: {
      ...CS.row,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
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
      marginTop: 10,
      marginHorizontal: 16,
      gap: 8,
      marginBottom: 20,
    },
    styleTotalToday: {
      flexDirection: "column",
      alignItems: "flex-end",
      flex: 1,
    },
    txtToday: {
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.white,
    },
    txtCommissionToday: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.white,
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
      marginLeft: 8,
      marginTop: 3,
    },
    viewAvatar: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    viewProfileBtn: {
      backgroundColor: colors.black,
      height: 29,
      width: 90,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
  });
};
