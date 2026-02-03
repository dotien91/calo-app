import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Layout constants (không phụ thuộc theme)
export const PHONE_WIDTH = width * 0.65;
export const PHONE_HEIGHT = PHONE_WIDTH * 2;
export const FRAME_SIZE = PHONE_WIDTH * 0.7;
export const STROKE_WIDTH = 4;
export const CORNER_LENGTH = 30;
export const CORNER_RADIUS = 16;

export default (theme: Theme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    langButton: {
      position: "absolute",
      right: 20,
      zIndex: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      gap: 6,
    },
    langText: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 12,
    },
    centerContainer: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 40,
    },
    phoneMockup: {
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: colors.border,
      backgroundColor: colors.background,
      overflow: "hidden",
      position: "relative",
      shadowColor: theme.dark ? "#000" : "#FFF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    phoneNotch: {
      position: "absolute",
      top: 10,
      alignSelf: "center",
      width: 80,
      height: 24,
      backgroundColor: colors.background,
      borderRadius: 12,
      zIndex: 20,
    },
    phoneScreen: {
      flex: 1,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    fakeShutterButton: {
      position: "absolute",
      bottom: 30,
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 3,
      borderColor: colors.text,
      backgroundColor: "transparent",
    },
    frameContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    bottomSection: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.text,
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 40,
    },
    startButton: {
      width: "100%",
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    signInRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    signInText: {
      color: colors.textOpacity8,
      fontSize: 14,
    },
    signInLink: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 14,
    },
  });
};
