import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

import CS from "@theme/styles";

interface Style {
  container: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      backgroundColor: colors.white,
    },
    courseItem: {
      padding: 16,
      paddingTop: 0,
    },
    courseImg: {
      borderRadius: 10,
    },
    courseItemHorizontal: {
      marginBottom: 16,
      paddingHorizontal: 16,
      ...CS.flexStart,
      flex: 1,
      alignItems: "flex-start",
    },
    courseTitle: {
      ...CS.hnSemiBold,
      color: colors.text,
    },
    boxContent: {
      marginLeft: 12,
    },
    viewPrice: {
      ...CS.row,
      gap: 8,
    },
    coursePriceTxt: {
      ...CS.hnSemiBold,
      color: colors.textOpacity8,
      marginRight: 3,
    },
    coursePriceTxtOld: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
      marginRight: 3,
      textDecorationLine: "line-through",
    },
    courseRatingTxt: {
      ...CS.hnSemiBold,
      color: colors.textOpacity8,
      fontSize: 14,
    },
    textNoReview: {
      ...CS.hnRegular,
      color: colors.textOpacity8,
      fontSize: 14,
    },
    courseAuthorTxt: {
      ...CS.hnRegular,
      color: colors.textOpacity6,
      fontSize: 16,
      marginBottom: 4,
    },
    tutorItem: {
      margin: 16,
      paddingBottom: 16,
      marginTop: 0,
      ...CS.borderBottomStyle,
    },
    iconLike: {
      position: "absolute",
      right: 0,
      top: -10,
    },
    iconFlag: {
      position: "absolute",
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    tutorName: {
      ...CS.hnSemiBold,
      color: colors.text,
      flex: 0.9,
    },
    lessonTxt: {
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.textOpacity4,
    },
    tutorIntro: {
      ...CS.hnRegular,
      fontSize: 14,
      marginBottom: 8,
      color: colors.textOpacity8,
    },
    tutorInfoTxt: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity6,
    },
    viewDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textOpacity6,
    },
    viewCount: {
      marginTop: 16,
      paddingHorizontal: 20,
      height: 52,
      flexDirection: "row",
      gap: 8,
    },
    itemCount: {
      paddingHorizontal: 20,
      ...CS.center,
      minHeight: 50,
      minWidth: 60,
    },
    textCount: {
      ...CS.hnRegular,
      fontSize: 14,
    },
    textDes: {
      color: colors.textOpacity8,
    },
  });
};
