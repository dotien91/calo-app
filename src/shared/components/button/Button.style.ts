import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    viewButton: {
      height: 48,
      borderRadius: 30,
      backgroundColor: colors.mainColor2,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      flexDirection: "row",
    },
    textButton: {
      ...CommonStyle.hnSemiBold,
      color: colors.white,
      fontSize: 16,
    },
  });
};
