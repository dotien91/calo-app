import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  container: ViewStyle;
  viewDes: ViewStyle;
  txtTitle: TextStyle;
  txtDes: TextStyle;
  txtProgress: TextStyle;
  txtStatus: TextStyle;
  viewPoint: ViewStyle;
  txtPoint: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 8,
    },
    viewDes: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.grey2,
      flex: 1,
      paddingVertical: 8,
    },
    txtTitle: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
      maxWidth: 200,
    },
    txtDes: {
      ...CS.hnMedium,
      fontSize: 12,
      color: colors.textOpacity6,
    },
    txtProgress: {
      marginLeft: 16,
      ...CS.hnRegular,
      color: colors.textOpacity8,
      fontSize: 14,
    },
    txtStatus: { ...CS.hnMedium, fontSize: 12, color: colors.textOpacity6 },
    viewPoint: {
      justifyContent: "flex-end",
      alignItems: "center",
      marginRight: 16,
    },
    txtPoint: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.text,
      width: 20,
      textAlign: "right",
    },
  });
};
