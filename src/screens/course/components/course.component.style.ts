import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

import CS from "@theme/styles";

interface Style {
  container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.white,
    },
    ratingBox: {
      ...CS.flexStart,
    },
  });
};
