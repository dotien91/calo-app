import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    viewButton: {
      paddingVertical: 12,
      borderRadius: 30,
      backgroundColor: colors.mainColor2,
      ...CommonStyle.flexCenter,
      paddingHorizontal: 30,
    },
    textButton: {
      ...CommonStyle.hnSemiBold,
      color: colors.white,
      fontSize: 16,
    },
  });
};
