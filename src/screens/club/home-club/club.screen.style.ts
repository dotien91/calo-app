// import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  styleItem: ViewStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    styleItem: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
  });
};
