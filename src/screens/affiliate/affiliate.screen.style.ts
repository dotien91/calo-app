import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle, Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";

interface Style {
  container: ViewStyle;
  styleViewTotalAff: ViewStyle;
  styleTotalToday: ViewStyle;
  styleImageBg2: ViewStyle;
  styleViewLine: ViewStyle;
  styleViewTotal: ViewStyle;
  styleButton: ViewStyle;
  viewHeaderFake: ViewStyle;
  txtHeader: TextStyle;
  backgroundHeader: ViewStyle;
  txtToday: TextStyle;
  txtCommissionToday: TextStyle;
  txtCommissionMonth: TextStyle;
  txtMonth: TextStyle;
}
const width = Dimensions.get("screen").width;

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    styleViewTotalAff: {
      flexDirection: "row",
      marginTop: 10,
      marginHorizontal: 16,
      gap: 8,
    },
    styleTotalToday: {
      flexDirection: "column",
      alignItems: "flex-end",
      flex: 1,
    },
    styleImageBg2: {
      flex: 1,
      height: 200,
      width: (width - 40) / 2,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: "space-between",
    },
    styleViewLine: {
      flex: 1,
      height: "100%",
      gap: 12,
    },
    styleViewTotal: {
      backgroundColor: colors.grey1,
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    styleButton: {},
    txtMoneyHeader: {
      marginTop: 8,
      marginBottom: 12,
    },
    viewHeaderFake: {
      marginTop: getStatusBarHeight(),
      alignItems: "center",
      height: 40,
      flexDirection: "row",
      paddingHorizontal: 16,
    },
    txtHeader: {
      ...CS.hnRegular,
      color: colors.white8,
      ...CS.flex1,
      textAlign: "center",
    },
    backgroundHeader: {
      height: 202,
      width: "100%",
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
    txtMonth: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity6,
    },
    txtCommissionMonth: {
      ...CS.hnMedium,
      fontSize: 16,
      color: colors.textOpacity8,
    },
  });
};
