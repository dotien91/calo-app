import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 2,
      backgroundColor: colors.background,
      paddingTop: 14,
      paddingBottom: 4,
    },

    containerLikeShare: {
      flexDirection: "row",
      marginTop: 4,
      alignItems: "center",
      gap: 8,
    },
    viewLike: {
      flexDirection: "row",
      alignItems: "center",
    },
    textLikeShare: {
      ...CommonStyle.hnRegular,
      fontSize: 12,
      color: colors.text,
    },
    textLiked: {
      ...CommonStyle.hnRegular,
      fontSize: 12,
      color: colors.primary,
    },
  });
};
