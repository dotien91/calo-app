import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

import CS from "@theme/styles";

interface Style {
  wrapBtnFilter: ViewStyle;
  btnFilter: ViewStyle;
  txtFilter: TextStyle;
  txtViewMore: TextStyle;
  typeLearningLabel: ViewStyle;
  audioItem: ViewStyle;
  courseImg: ViewStyle;
  audioTitle: TextStyle;
  audioAuthorTxt: TextStyle;
  viewPrice: ViewStyle;
  audioPriceTxt: TextStyle;
  audioPriceTxtOld: TextStyle;
  audioRatingTxt: TextStyle;
  textNoReview: TextStyle;
  viewItem: ViewStyle;
  txtSlug: TextStyle;
  txtContent: TextStyle;
  audioItem1: ViewStyle;
  viewHastag: ViewStyle;
  btnPlay: ViewStyle;
  viewIconPlay: ViewStyle;
  txtPlay: TextStyle;
  viewIsWatched: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    wrapBtnFilter: {
      ...CS.flexStart,
      paddingLeft: 16,
    },
    btnFilter: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 99,
      backgroundColor: colors.btnInactive,
      marginRight: 8,
      flex: 1,
    },
    txtFilter: {
      ...CS.hnRegular,
      fontSize: 16,
      color: colors.textOpacity6,
    },
    txtViewMore: {
      ...CS.hnMedium,
      fontSize: 14,
      color: colors.textOpacity6,
    },
    typeLearningLabel: {
      ...CS.hnSemiBold,
      fontSize: 16,
      marginBottom: 6,
    },
    audioItem: {
      padding: 16,
      paddingTop: 0,
    },
    audioItem1: {
      padding: 16,
      paddingTop: 0,
    },
    courseImg: {
      borderRadius: 10,
    },
    audioTitle: {
      ...CS.hnSemiBold,
      color: colors.white,
      fontSize: 16,
      marginBottom: 4,
    },
    audioAuthorTxt: {
      ...CS.hnRegular,
      color: colors.textOpacity6,
      fontSize: 12,
      marginBottom: 4,
    },
    viewPrice: {
      ...CS.row,
      gap: 8,
    },
    audioPriceTxt: {
      ...CS.hnSemiBold,
      color: colors.textOpacity8,
      marginRight: 3,
    },
    audioPriceTxtOld: {
      ...CS.hnRegular,
      fontSize: 14,
      color: colors.textOpacity8,
      marginRight: 3,
      textDecorationLine: "line-through",
    },
    audioRatingTxt: {
      ...CS.hnSemiBold,
      color: colors.textOpacity8,
      fontSize: 14,
    },
    textNoReview: {
      ...CS.hnRegular,
      color: colors.textOpacity8,
      fontSize: 14,
      marginBottom: 4,
    },
    viewItem: {
      flex: 1,
      flexDirection: "row",
      gap: 8,
    },
    txtSlug: {
      ...CS.hnSemiBold,
      color: colors.blue,
      fontSize: 14,
      marginBottom: 4,
    },
    txtContent: {
      ...CS.hnRegular,
      color: colors.textOpacity6,
      fontSize: 14,
      marginBottom: 4,
    },
    viewHastag: {
      ...CS.row,
      gap: 8,
    },
    btnPlay: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.borderColor,
      ...CS.row,
      gap: 8,
    },
    viewIconPlay: {
      width: 16,
      height: 16,
      borderRadius: 12,
      backgroundColor: colors.primary,
      ...CS.center,
    },
    txtPlay: {
      ...CS.hnBold,
      color: colors.textOpacity6,
      fontSize: 12,
    },
    viewIsWatched: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: colors.green2,
      zIndex: 1,
    },
  });
};
