import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
      padding: 12,
    },
    headerLeft: {
      marginBottom: 20,
    },
    topAction: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatar: {
      width: 82,
      height: 82,
      borderRadius: 33,
      marginBottom: 12,
    },
    txtName: {
      ...CommonStyle.hnBold,
      fontSize: 20,
      marginBottom: 12,
    },
    wrapTopBtn: {
      ...CommonStyle.flexCenter,
    },
    topActionBtn: {
      ...CommonStyle.borderStyle,
      borderWidth: 2,
      borderRadius: 6,
      width: 42,
      height: 35,
      marginRight: 8,
    },
    section: {
      marginBottom: 20,
      paddingHorizontal: 12,
    },
    menu: {
      ...CommonStyle.flexStart,
      marginBottom: 8,
    },
    menuIcon: {
      marginRight: 4,
    },
    titleSection: {
      ...CommonStyle.hnBold,
      fontSize: 18,
      marginBottom: 4,
    },
    iconArrow: {
      position: "absolute",
      right: 0,
      top: 0,
    },
    wrapMedia: {
      ...CommonStyle.flexStart,
    },
    viewMoreMedia: {
      width: 76,
      height: 76,
      // ...CommonStyle.borderStyle,
      // borderWidth: 2,
      borderRadius: 10,
      ...CommonStyle.flexCenter,
      backgroundColor: colors.lightOverlay,
      position: "absolute",
      right: 0,
      top: 0,
    },
    txtViewMoreMedia: {
      ...CommonStyle.hnBold,
      color: colors.grey3,
      fontSize: 20,
    },
  });
};
