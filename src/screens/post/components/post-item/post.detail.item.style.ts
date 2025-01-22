import { Dimensions, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
// const SIZE_AVATAR = 32;
const FONT_SIZE = 16;
// const PADDING_LEFT = 12;
const SIZE_IMAGE = width - PADDING_HORIZONTAL * 2;
export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: PADDING_HORIZONTAL,
      marginBottom: 2,
      // backgroundColor: colors.background,
      paddingTop: 14,
      paddingBottom: 4,
    },
    image11: {
      minHeight: SIZE_IMAGE,
      width: SIZE_IMAGE,
      paddingVertical: 4,
      borderRadius: 4,
    },

    containerLikeShare: {
      flexDirection: "row",
      marginVertical: 4,
      justifyContent: "space-between",
      alignItems: "center",
    },
    viewLike: {
      flexDirection: "row",
      alignItems: "center",
      ...CommonStyle.flex1,
    },
    textLikeShare: {
      ...CommonStyle.hnRegular,
      fontSize: FONT_SIZE,
      color: colors.text,
      marginLeft: 8,
    },
    link: {
      color: "blue",
      textDecorationLine: "underline",
    },
  });
};
