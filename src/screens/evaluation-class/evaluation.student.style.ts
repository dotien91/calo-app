import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CS from "@theme/styles";
export const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    imageStyle: {
      height: 60,
      width: 60,
      borderRadius: 40,
    },
    viewItem: {
      ...CS.row,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: colors.borderColor,
      gap: 16,
    },
    viewInfor: {
      flex: 1,
      gap: 4,
    },
    textName: {
      ...CS.hnBold,
      fontSize: 18,
    },
    textReview: {
      ...CS.hnRegular,
      color: colors.white6,
    },
    viewInput: {
      gap: 16,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    textHeader: {
      ...CS.hnBold,
      fontSize: 20,
    },
    gap: {
      gap: 8,
    },
    viewBtn: {
      // ...CS.flex1,
      flexDirection: "row",
      ...CS.center,
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.primary,
      gap: 8,
    },
    textBtn: {
      ...CS.hnBold,
      color: colors.white,
    },
  });
};
