import CommonStyle from "@theme/styles";
import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 10,
    },
    viewInput: {
      ...CommonStyle.flex1,
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 2,
      height: 40,
      paddingHorizontal: 10,
      gap: 10,
      alignItems: "center",
    },
  });
};
