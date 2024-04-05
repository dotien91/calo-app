import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    listChat: {
      paddingBottom: 250,
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
      color: colors.mainColor2,
      flex: 1,
    },
    timeTxt: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      color: colors.grey2,
    },
    lastMessageTxt: {
      color: colors.grey2,
      ...CommonStyle.hnBold,
      fontSize: 16,
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
      color: colors.mainColor2,
      fontSize: 16,
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
      color: colors.mainColor2,
    },
    wrapMediaBtn: {
      ...CommonStyle.flexEnd,
      marginLeft: 10,
    },
    wrapInput: {
      ...CommonStyle.borderStyle,
      flex: 1,
      ...CommonStyle.flexRear,
      borderWidth: 2,
      borderColor: colors.borderColor2,
      borderRadius: 8,
      paddingLeft: 12,
    },
    wrapInputToolbar: {
      ...CommonStyle.flexRear,
      paddingHorizontal: 12,
    },
    input: {
      // height: 40,
      borderWidth: 0,
    },
    btnMedia: {
      marginRight: 12,
    },
    btnAction: {
      ...CommonStyle.flexCenter,
      borderRadius: 8,
      ...CommonStyle.borderStyle,
      borderColor: colors.mainColor2,
      borderWidth: 2,
      width: 42,
      height: 42,
      backgroundColor: palette.primary,
      marginLeft: 6,
    },
    wrapHeader: {
      ...CommonStyle.flexRear,
      paddingTop: 4,
      ...CommonStyle.borderStyle,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: colors.borderColor2,
      width: "100%",
      height: 66,
      paddingRight: 12,
    },
    headerLeft: {
      ...CommonStyle.flexStart,
      flex: 1,
      flexDirection: "row",
    },
    roomInfo: {
      marginLeft: 16,
      // flex: 1,
      flexDirection: "row",
    },
    txtNamePartner: {
      ...CommonStyle.hnBold,
      color: colors.text,
      fontSize: 20,
    },
    txtReadAt: {
      ...CommonStyle.hnRegular,
      fontSize: 12,
      color: colors.timeColor,
      flex: 1,
    },
    headerRight: {
      flex: 0.3,
      ...CommonStyle.flexEnd,
    },
    emptyView: {
      flex: 1,
      // transform: [{ scaleY: isIOS ? -1: 1 }],
      ...CommonStyle.flexCenter,
      marginTop: "30%",
    },
  });
};
