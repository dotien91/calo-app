import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

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
      marginTop: 0,
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
      color: colors.textOpacity6,
    },
    textReply: {
      ...CommonStyle.hnRegular,
      fontSize: 12,
      color: colors.textOpacity8,
    },
    textLiked: {
      ...CommonStyle.hnRegular,
      fontSize: 12,
      color: colors.primary,
    },
    containerHeader: {
      flexDirection: "row",
      justifyContent: "center",
    },
    viewTxtHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      ...CommonStyle.flex1,
    },
    txtHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 16,
      color: colors.mainColor2,
      maxWidth: 220,
    },
    txtTimeHeader: {
      ...CommonStyle.hnRegular,
      color: colors.textOpacity6,
      fontSize: 12,
    },
    viewDot: {
      width: 2,
      height: 2,
      borderRadius: 1,
      backgroundColor: colors.text,
    },
    viewContentComment: {
      flexDirection: "row",
    },
    txtContentComment: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      marginBottom: 4,
      color: palette.textOpacity2,
    },
    containerItemRep: {
      flexDirection: "row",
      width: "100%",
      marginTop: 4,
    },
    viewImage: {
      width: 150,
      minHeight: 90,
      borderRadius: 8,
    },
  });
};
