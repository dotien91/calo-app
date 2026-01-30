import { StyleSheet, TextStyle, ViewStyle } from "react-native";

export interface ChooseLanguageViewStyle {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  optionsContainer: ViewStyle;
  optionCard: ViewStyle;
  flag: TextStyle;
}

type ThemeColors = Record<string, string>;

export default (theme: { colors: ThemeColors }) => {
  const { colors } = theme;
  return StyleSheet.create<ChooseLanguageViewStyle>({
    container: {
      paddingVertical: 8,
      paddingBottom: 24,
      backgroundColor: colors.background ?? colors.card,
    },
    title: {
      textAlign: "center",
      marginBottom: 8,
      color: colors.text,
    },
    subtitle: {
      textAlign: "center",
      marginBottom: 20,
      color: colors.textOpacity8 ?? colors.text,
    },
    optionsContainer: {
      gap: 12,
    },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      gap: 12,
    },
    flag: {
      fontSize: 22,
    },
  });
};
