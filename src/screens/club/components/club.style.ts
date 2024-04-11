// import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  styleItem: ViewStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    styleItem: {
      flex: 1,
      marginHorizontal: 16,
      marginBottom: 16,
      paddingTop: 10,
    },
  });
};
