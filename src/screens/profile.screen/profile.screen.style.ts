import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  viewItemScrollMoney: ViewStyle;
  viewInforuser: ViewStyle;
  textLevel: TextStyle;
  textInviteFriend: TextStyle;
  textSeeAll: TextStyle;
  textTasks: TextStyle;
  textPoweredBy: TextStyle;
  textInviteCode: TextStyle;
  touchShare: ViewStyle;
  textNumberMoney: TextStyle;
  textYourScore: TextStyle;
  textMyCode: TextStyle;
  textShare: TextStyle;
  boxLevel: ViewStyle;
  viewLineInviteFriend: ViewStyle;
  textDesciption: TextStyle;
  viewInviteFriend: ViewStyle;
  viewInviteFriendTop: ViewStyle;
  viewDisplayname: ViewStyle;
  textDisplayName: TextStyle;
  viewPowered: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    viewItemScrollMoney: {
      ...CS.row,
      borderWidth: 1,
      borderRadius: 8,
      width: 225,
      height: 66,
      marginRight: 12,
      backgroundColor: colors.backgroundColorGrey,
      borderColor: colors.backgroundColorGrey,
    },
    textNumberMoney: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.textOpacity8,
    },
    viewInforuser: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginTop: 16,
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
    textInviteFriend: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
      marginVertical: 16,
    },
    textSeeAll: {
      ...CS.hnMedium,
      fontSize: 14,
      color: colors.btnRedPrimary,
    },
    textTasks: { ...CS.hnSemiBold, fontSize: 16, color: colors.text },
    textPoweredBy: {
      ...CS.hnMedium,
      fontSize: 10,
      color: colors.textOpacity4,
      marginRight: 4,
    },
    textInviteCode: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.btnRedPrimary,
    },
    touchShare: {
      flexDirection: "row",
      backgroundColor: colors.btnRedPrimary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    textYourScore: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
      marginVertical: 32,
    },
    textMyCode: {
      ...CS.hnMedium,
      fontSize: 12,
      color: colors.textOpacity6,
    },
    textShare: { ...CS.hnSemiBold, fontSize: 16, color: colors.white },
    viewLineInviteFriend: {
      height: 1,
      backgroundColor: colors.grey3,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    textDesciption: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 8,
    },
    viewInviteFriend: {
      backgroundColor: colors.backgroundColorGrey,
      borderRadius: 8,
    },
    viewInviteFriendTop: {
      ...CS.row,
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    viewDisplayname: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    textDisplayName: { ...CS.hnSemiBold, fontSize: 16, color: colors.text },
    viewPowered: { flexDirection: "row", marginTop: 32, marginLeft: 20 },
  });
};
