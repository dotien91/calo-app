import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    box: { ...CommonStyle.flexRear, width: "100%", paddingHorizontal: 16 },
    wrapInput: {
      ...CommonStyle.flexStart,
      borderRadius: 8,
      flex: 1,
      height: 32,
      backgroundColor: colors.bgInput,
    },
    searchInput: {
      paddingLeft: 40,
      color: colors.textOpacity4,
      flex: 1,
    },
    iconSearch: {
      color: colors.textOpacity6,
      position: "absolute",
      left: 12,
      top: 6,
    },
    iconClose: {
      position: "absolute",
      right: 10,
      top: -10,
      color: colors.mainColor2,
    },
  });
};
