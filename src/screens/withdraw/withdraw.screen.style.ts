import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.ui.utils";

interface Style {
  container: ViewStyle;
  userContainer: ViewStyle;
  userButton: ViewStyle;
}

const imageWidth = (Device.width - 64) / 4;

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    yourAmountBox: {
      ...CS.flexStart,
      marginBottom: 16,
    },
    txtSmall: {
      ...CS.hnRegular,
      fontSize: 12,
      color: colors.textOpacity6,
    },
    txtBold: {
      ...CS.hnBold,
      color: colors.text,
    },
    input: {
      height: 40,
      ...CS.borderStyle,
      borderColor: colors.borderInput,
      paddingVertical: 0,
      ...CS.flexStart,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    inputBox: {
      marginBottom: 16,
    },
    txt: {
      ...CS.hnRegular,
      marginBottom: 8,
    },
    txtAddBank: {
      ...CS.hnMedium,
      color: colors.primary,
      textDecorationLine: "underline",
    },
    btn: {
      position: "absolute",
      left: 16,
      bottom: 12,
      right: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      ...CS.flexCenter,
    },
    txtBtn: {
      ...CS.hnSemiBold,
      color: palette.white,
    },
    wrapImage: {
      ...CS.borderStyle,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      width: imageWidth + 2,
      height: imageWidth + 2,
      ...CS.flexCenter,
    },
    image: {
      width: imageWidth,
      height: imageWidth,
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 99,
      ...CS.borderStyle,
      borderWidth: 2,
      borderColor: palette.primary,
      ...CS.flexCenter,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 99,
      backgroundColor: palette.primary,
    },
    closeIcon: {
      position: "absolute",
      right: -18,
      top: -18,
      zIndex: 1,
    },
  });
};
