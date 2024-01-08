import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    buttonFlag: {
      height: 25,
      marginTop: 20,
      flexDirection: "row",
      color: colors.highlight,
      alignItems: "center",
    },
    textButton: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      color: colors.text,
      paddingLeft: 18,
    },
  });
};
