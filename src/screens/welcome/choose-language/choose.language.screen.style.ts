import CommonStyle from "@theme/styles";
import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

import {
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-screen-helper";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
      paddingTop: getStatusBarHeight(),
      marginBottom: getBottomSpace(),
      paddingBottom: 10,
    },
    textHeader: {
      ...CommonStyle.hnSemiBold,
      marginLeft: 20,
      fontSize: 26,
      color: colors.mainColor2,
    },
    viewSearch: {
      ...CommonStyle.row,
      height: 44,
      marginLeft: 20,
      marginRight: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 12,
      backgroundColor: colors.background2,
    },
    textSearch: {
      ...CommonStyle.flex1,
      ...CommonStyle.hnMedium,
      fontSize: 14,
      color: colors.mainColor2,
    },
    child: {
      ...CommonStyle.flex1,
      marginTop: 26,
      backgroundColor: colors.background2,
    },
    itemLanguageSelected: {
      ...CommonStyle.row,
      height: 88,
      paddingLeft: 16,
      paddingRight: 24,
      justifyContent: "space-between",
      backgroundColor: "#F2FFFB",
    },
    itemLanguageNotSelected: {
      ...CommonStyle.row,
      height: 88,
      paddingLeft: 16,
      paddingRight: 24,
      justifyContent: "space-between",
      backgroundColor: colors.background2,
    },
    textLanguage: {
      ...CommonStyle.hnSemiBold,
      fontSize: 18,
      color: colors.mainColor2,
      marginLeft: 16,
    },
    btnStyle: {
      height: 40,
    },
    paddingBtnStyle: {
      paddingHorizontal: 20,
    },
  });
};

export default createStyles;
