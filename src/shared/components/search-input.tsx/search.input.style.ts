import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    box: { ...CommonStyle.flexRear, width: "100%", paddingHorizontal: 16 },
    wrapInput: {
      ...CommonStyle.flexStart,
      borderRadius: 8,
      flex: 1,
      height: 32,
      backgroundColor: palette.bgInput2,
    },
    searchInput: {
      paddingLeft: 40,
      paddingVertical: 0,
      color: colors.textOpacity4,
      flex: 1,
      fontSize: 14,
    },
    iconSearch: {
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
