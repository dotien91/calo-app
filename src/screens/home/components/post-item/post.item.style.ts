import { Dimensions, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 32;
const FONT_SIZE = 16;
const BORDER_RADIUS1 = 4;
const BORDER_RADIUS2 = 4;
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
    viewPlayvideo: {
      ...CommonStyle.fillParent,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image11: {
      height: SIZE_IMAGE1,
      width: SIZE_IMAGE1,
      borderRadius: BORDER_RADIUS1,
    },
    viewImage2: {
      flexDirection: "row",
      height: (SIZE_IMAGE1 - 4) / 2,
      gap: 4,
    },
    viewImage3: {
      flexDirection: "row",
      height: ((SIZE_IMAGE1 - 4) * 3) / 5,
      gap: 4,
    },
    imageNormal: {
      ...CommonStyle.flex1,
      borderRadius: BORDER_RADIUS2,
    },
    containerLikeShare: {
      flexDirection: "row",
      marginTop: 4,
      justifyContent: "space-between",
      alignItems: "center",
    },
    viewLike: {
      ...CommonStyle.flex1,
      flexDirection: "row",
      alignItems: "center",
    },
    textLikeShare: {
      ...CommonStyle.hnRegular,
      fontSize: FONT_SIZE,
      color: colors.text,
      marginLeft: 8,
    },
    viewMore: {
      ...CommonStyle.fillParent,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.blackOverlay,
      borderRadius: 4,
    },
  });
};
