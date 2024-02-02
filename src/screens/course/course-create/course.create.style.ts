import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import CS from "@theme/styles";

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    viewImage: {
      width: 160,
      height: 90,
      backgroundColor: colors.placeholder,
    },
    viewImageFill: {
      ...CS.fillParent,
      ...CS.center,
      backgroundColor: colors.placeholder,
    },
    category: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    categorySelected: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.highlight,
    },
    label: {
      ...CS.hnMedium,
      color: colors.text,
      marginBottom: 8,
    },
    durationBtn: {
      padding: 4,
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginHorizontal: 4,
      ...CS.flexCenter,
      borderRadius: 4,
    },
    selectBox: {
      marginBottom: 16,
    },
    txtBtn: {
      ...CS.hnSemiBold,
      color: colors.textOpacity6,
    },
  });
};
