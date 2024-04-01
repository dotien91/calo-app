import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  viewInviteFriend: ViewStyle;
  viewInviteFriendTop: ViewStyle;
  viewDisplayname: ViewStyle;
  textDisplayName: TextStyle;
  viewPowered: TextStyle;
  textMyCode: TextStyle;
  textInviteCode: TextStyle;
  touchShare: ViewStyle;
  textYourScore: TextStyle;
  textShare: TextStyle;
  viewLineInviteFriend: ViewStyle;
  textDesciption: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
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
    textMyCode: {
      ...CS.hnMedium,
      fontSize: 12,
      color: colors.textOpacity6,
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
  });
};
