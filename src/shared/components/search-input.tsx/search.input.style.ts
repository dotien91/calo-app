import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    box: { ...CommonStyle.flexRear, width: "100%", paddingHorizontal: 12 },
    wrapInput: {
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
  });
};
