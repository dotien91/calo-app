import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { isIOS } from "@freakycoder/react-native-helpers";
import { getStatusBarHeight } from "react-native-safearea-height";
// import CS from "@theme/styles";

interface Style {}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      paddingTop: isIOS ? 0 : getStatusBarHeight(),
    },
    styleShawdow: {
      shadowColor: "#000000",
      borderWidth: 1,
      borderColor: colors.white,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 3.05,
      shadowOpacity: 0.17,
      elevation: 4,
      borderRadius: 8,
      backgroundColor: colors.white,
    },
  });
};
