import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";
import { getStatusBarHeight } from "react-native-safearea-height";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
      paddingTop: getStatusBarHeight(),
    },
    listView: {
      paddingBottom: 100,
    },
    item: {
      ...CommonStyle.flexStart,
      padding: 8,
      ...CommonStyle.borderBottomStyle,
      borderBottomWidth: 0.5,
    },
    friendNameTxt: {
      ...CommonStyle.hnRegular,
      color: colors.mainColor2,
      fontSize: 16,
      marginLeft: 10,
      alignSelf: "flex-start",
      // width: '100%'
    },
    wrapCheckbox: {
      width: 30,
      height: 30,
      borderRadius: 99,
      ...CommonStyle.flexCenter,
      ...CommonStyle.borderStyle,
    },
    headerTitle: {
      ...CommonStyle.headerTitle,
      paddingHorizontal: 16,
      marginBottom: 6,
    },
  });
};
