import { StyleSheet } from "react-native";
import CommonStyle from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    textHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 32,
      color: colors.mainColor2,
      textAlign: "center",
    },
    buttonMargin: {
      marginTop: 16,
      paddingHorizontal: 20,
    },
    viewInput: {
      marginTop: 16,
      marginHorizontal: 20,
      paddingHorizontal: 20,
      height: 48,
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: colors.mainColor2,
      gap: 15,
    },
    viewSocial: {
      flexDirection: "row",
      gap: 18,
      paddingHorizontal: 20,
      marginTop: 16,
    },
    textRegister: {
      ...CommonStyle.hnMedium,
      color: colors.mainColor2,
      textAlign: "center",
      marginTop: 16,
    },
    textWarning: {
      paddingHorizontal: 20,
      color: colors.primary,
    },
  });
};
export default createStyles;
