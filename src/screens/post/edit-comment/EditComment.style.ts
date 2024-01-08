import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
    },
    viewInput: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginHorizontal: 16,
      height: 40,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    viewButton: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginHorizontal: 16,
      marginTop: 8,
      gap: 8,
    },
    btnCancel: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.background2,
      padding: 8,
    },
    txtCancel: {
      color: colors.mainColor2,
    },
    btnUpdateDisable: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.mainColor2,
      padding: 8,
    },
    btnUpdate: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.primary,
      padding: 8,
    },
  });
};
