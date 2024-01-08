import { Dimensions, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 30;
const FONT_SIZE = 16;
const BORDER_RADIUS1 = 16;
const BORDER_RADIUS2 = 12;
const PADDING_LEFT = 12;
const SIZE_IMAGE1 = width - PADDING_HORIZONTAL * 2 - PADDING_LEFT - SIZE_AVATAR;
export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: PADDING_HORIZONTAL,
      marginBottom: 2,
      backgroundColor: colors.background,
      paddingTop: 14,
      paddingBottom: 4,
    },
    image11: {
      height: SIZE_IMAGE1,
      width: SIZE_IMAGE1,
      borderRadius: BORDER_RADIUS1,
    },
    image12: {
      flex: 1,
      borderTopLeftRadius: BORDER_RADIUS2,
      borderBottomLeftRadius: BORDER_RADIUS2,
    },
    image22: {
      flex: 1,
      borderTopRightRadius: BORDER_RADIUS2,
      borderBottomRightRadius: BORDER_RADIUS2,
    },
    image23: {
      flex: 1,
      borderTopRightRadius: BORDER_RADIUS2,
    },
    image33: {
      flex: 1,
      borderBottomRightRadius: BORDER_RADIUS2,
    },

    containerLikeShare: {
      flexDirection: "row",
      marginTop: 4,
      justifyContent: "space-between",
      alignItems: "center",
    },
    viewLike: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    textLikeShare: {
      ...CommonStyle.hnRegular,
      fontSize: FONT_SIZE,
      color: colors.text,
      marginLeft: 8,
    },
  });
};
