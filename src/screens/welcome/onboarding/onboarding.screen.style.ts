import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type ThemeLike = { colors: Record<string, string>; dark?: boolean };

/**
 * Best practice: useTheme() + createStyles(theme) — single source of truth from navigation theme.
 * Same pattern as ChooseLanguageView.style.ts.
 */
export const createStyles = (theme: ThemeLike) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background ?? colors.card,
    },
    scrollView: { flex: 1 },
    contentContainer: { padding: 16, paddingTop: 40, paddingBottom: 100 },
    title: {
      textAlign: "center",
      marginBottom: 12,
      color: colors.text,
    },
    subtitle: {
      textAlign: "center",
      marginBottom: 32,
      color: colors.textOpacity8 ?? colors.text,
    },
    optionsContainer: { gap: 16, marginTop: 20 },
    optionCard: {
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
    },
    optionButton: {
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: "center",
    },
    optionDesc: { marginTop: 4 },
    footer: {
      padding: 16,
    },
    button: {
      width: "100%",
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    // PlanResultScreen styles (with theme colors where needed)
    header: { marginBottom: 24, alignItems: "center" },
    card: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardHeader: { marginBottom: 16 },
    goalRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    goalItem: { flex: 1, alignItems: "center" },
    goalArrow: { paddingHorizontal: 16 },
    goalValue: { marginTop: 4 },
    goalInfo: { marginTop: 12, alignItems: "center" },
    infoGrid: { gap: 12 },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    caloriesContainer: { alignItems: "center", paddingVertical: 20 },
    caloriesValue: { marginBottom: 8 },
    macroContainer: { gap: 16 },
    macroItem: { flexDirection: "row", alignItems: "center", gap: 16 },
    macroBar: { width: 4, height: 60, borderRadius: 2 },
    macroContent: { flex: 1 },
    macroValue: { marginTop: 4 },
    infoCard: {
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      backgroundColor: theme.dark ? colors.card : ((colors.grey1 ?? "") + "20"),
    },
    infoText: { lineHeight: 20, color: colors.text },
    footerAbsolute: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: colors.background ?? colors.card,
    },
    restartButton: { marginTop: 12, borderWidth: 1 },
  });
};

/** Derived colors for inline use (e.g. selected state). Active bg = primaryDark, border = primary. */
export const getOnboardingColors = (theme: ThemeLike) => ({
  cardSelected: theme.colors.primaryDark ?? theme.colors.primary,
  borderSelected: theme.colors.primary,
});
