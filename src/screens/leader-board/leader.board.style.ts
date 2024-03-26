import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle, Dimensions } from "react-native";

import { palette } from "@theme/themes";
import CS from "@theme/styles";

const HEIGHT_ITEM_LEADERBOARD = 64;
const MARGIN_BOTTOM_ITEM = 8;
const screenWidth = Dimensions.get("window").width;

interface Style {
  txtRank: TextStyle;
  viewAvatar2: ViewStyle;
  viewTxtLevel2: ViewStyle;
  txtLevel2: TextStyle;
  txtName2: TextStyle;
  txtPoint2: TextStyle;
  viewItem: ViewStyle;
  viewBtn: ViewStyle;
  viewTop: ViewStyle;
  viewStyle: ViewStyle;
  avatarTop2: ViewStyle;
  viewTop2: ViewStyle;
  txtToptxtTop2: TextStyle;
  styleTop2: ViewStyle;
  styleVTop: ViewStyle;
  txtNameTop: TextStyle;
  txtPointTop2: TextStyle;
  txtViewPoint: TextStyle;
  txtTop: TextStyle;
  avatarTop1: ViewStyle;
  viewIcon: ViewStyle;
  viewTop1: ViewStyle;
  viewStyleTop1: ViewStyle;
  styleTop1: ViewStyle;
  txtPointTop1: TextStyle;
  avatarTop3: ViewStyle;
  viewTop3: ViewStyle;
  txtPointTop3: ViewStyle;
  styleTop3: ViewStyle;
  styleVTop1: ViewStyle;
  viewItem2: ViewStyle;
  styleBtn: ViewStyle;
  txtBtn: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    viewItem: {
      height: HEIGHT_ITEM_LEADERBOARD,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: MARGIN_BOTTOM_ITEM,
      borderRadius: 8,
      gap: 8,
      backgroundColor: colors.grey1,
    },
    txtRank: {
      marginLeft: 16,
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.textOpacity2,
    },
    viewAvatar2: {
      width: 46,
      height: 46,
      borderRadius: 99,
    },
    viewTxtLevel2: {
      zIndex: 99,
      backgroundColor: palette.primary,
      height: 12,
      width: 21,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: -5,
      left: 12,
    },
    txtLevel2: {
      ...CS.hnRegular,
      fontSize: 8,
      color: colors.white,
    },
    txtName2: {
      ...CS.hnSemiBold,
      lineHeight: 24,
      color: colors.textOpacity2,
    },
    txtPoint2: {
      ...CS.txtPoint,
      fontSize: 14,
      color: colors.textOpacity6,
    },
    viewTop: {
      height: 270,
      // marginHorizontal: 16,
      marginVertical: 8,
    },
    viewStyle: {
      flex: 1 / 3,
      justifyContent: "flex-end",
    },
    avatarTop2: {
      zIndex: 99,
      width: 64,
      height: 64,
      borderRadius: 32,
      position: "absolute",
      bottom: -25,
      left: screenWidth / 6 - 32 - 4,
      borderWidth: 3,
      borderColor: colors.blueBorder,
      zIndex: 1,
    },
    viewTop2: {
      zIndex: 99,
      backgroundColor: colors.blueBorder,
      height: 20,
      width: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: -25,
      right: screenWidth / 6 - 32 - 4,
    },
    txtTop: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.white,
    },
    styleTop2: {
      backgroundColor: colors.skyblue,
      flex: 1 / 2,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    styleVTop: {
      alignItems: "center",
      marginTop: 30,
    },
    txtNameTop: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.text,
    },
    txtPointTop2: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.blueBorder,
    },
    txtViewPoint: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
    },
    avatarTop1: {
      zIndex: 99,
      width: 88,
      height: 88,
      borderRadius: 44,
      position: "absolute",
      bottom: -40,
      left: screenWidth / 6 - 44 - 4,
      borderWidth: 3,
      borderColor: colors.gold,
    },
    viewIcon: {
      position: "absolute",
      bottom: 50,
      left: screenWidth / 6 - 13 - 8,
      zIndex: 99,
    },
    viewTop1: {
      zIndex: 99,
      backgroundColor: colors.gold,
      height: 20,
      width: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: -38,
      right: screenWidth / 6 - 44 - 4,
    },
    viewStyleTop1: {
      backgroundColor: colors.skin,
      flex: 0.7,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 32,
    },
    styleVTop1: {
      alignItems: "center",
      marginTop: 45,
    },
    txtPointTop1: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.gold,
    },
    txtPointTop3: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.greenText,
    },
    styleTop3: {
      backgroundColor: colors.greenOpa,
      flex: 0.4,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    viewTop3: {
      zIndex: 99,
      backgroundColor: colors.green,
      height: 20,
      width: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: -22,
      right: screenWidth / 6 - 28 - 8,
    },
    avatarTop3: {
      zIndex: 99,
      width: 56,
      height: 56,
      borderRadius: 28,
      position: "absolute",
      bottom: -22,
      left: screenWidth / 6 - 28 - 4,
      borderWidth: 3,
      borderColor: colors.green,
    },
    viewBtn: {
      alignItems: "center",
      backgroundColor: colors.white,
      position: "absolute",
      bottom: 0,
      width: "100%",
      //   height: 64,
      gap: 8,
      padding: 16,
      ...CS.borderTopStyle,
    },
    viewItem2: {
      // height: HEIGHT_ITEM_LEADERBOARD,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: MARGIN_BOTTOM_ITEM,
      gap: 8,
    },
    styleBtn: {
      height: 40,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: palette.primary,
    },
    txtBtn: {
      ...CS.txtBtnActive,
    },
    txtToptxtTop2: {},
    styleTop1: {},
  });
};
