import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: getStatusBarHeight() + 16,
    },
    listChat: {
      paddingBottom: 12,
    },
    chatItem: {
      ...CommonStyle.flexStart,
      flex: 1,
      padding: 16,
      ...CommonStyle.borderStyle,
      borderColor: colors.background2,
    },
    partnerNameTxt: {
      ...CommonStyle.hnBold,
      fontSize: 16,
      color: colors.text,
    },
    timeTxt: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      color: colors.textOpacity4,
    },
    lastMessageTxt: {
      ...CommonStyle.hnMedium,
      color: colors.text,
      fontSize: 16,
      flex: 1,
      textAlign: "left",
    },
    listFriend: {
      paddingLeft: 16,
    },
    headerTitle: {
      ...CommonStyle.headerTitle,
      paddingHorizontal: 16,
      marginBottom: 6,
    },
    friendNameTxt: {
      ...CommonStyle.hnRegular,
      color: colors.textOpacity8,
      fontSize: 14,
      // width: '100%'
    },
    wrapSearch: {
      ...CommonStyle.borderStyle,
      ...CommonStyle.flexStart,
      borderRadius: 30,
      flex: 1,
      height: 42,
    },
    searchInput: {
      paddingLeft: 40,
      color: colors.grey2,
      height: 40,
      flex: 1,
    },
    iconSearch: {
      color: colors.grey2,
      position: "absolute",
      left: 12,
      top: 10,
    },
    iconClose: {
      position: "absolute",
      right: 10,
      top: -10,
      color: colors.text,
    },
  });
};
