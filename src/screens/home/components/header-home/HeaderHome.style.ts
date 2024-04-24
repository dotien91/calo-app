import CommonStyle from "@theme/styles";
import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      paddingHorizontal: 16,
      paddingVertical: 8,
      paddingTop: 16,
      gap: 10,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      elevation: 10,
      shadowRadius: 1,
      // marginBottom: 8,
    },
    viewInput: {
      flexDirection: "row",
      height: 32,
      width: 32,
      ...CommonStyle.center,
      borderRadius: 99,
      backgroundColor: colors.grey1,
    },
    viewCup: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });
};
