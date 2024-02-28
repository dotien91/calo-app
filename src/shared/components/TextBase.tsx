import React, { memo, useMemo } from "react";

import { Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@react-navigation/native";

interface Props extends TextProps {
  title?: string | string[];
  style?: TextStyle;
  numberOfLines?: number;
  fontSize?: number;
  fontWeight?: "400" | "500" | "600" | "700" | undefined;
  color?: string;
  textAlign?: "center" | "left" | "right";
  marginBottom?: number;
}

// black: "SVN-Outfit-Black",
// bold: "SVN-Outfit-Bold",
// extraBold: "SVN-Outfit-ExtraBold",
// extraLight: "MonSVN-Outfittserrat-ExtraLight",
// light: "SVN-Outfit-Light",
// medium: "SVN-Outfit-Medium",
// regular: "SVN-Outfit-Regular",
// semiBold: "SVN-Outfit-SemiBold",
// thin: "SVN-Outfit-Thin",

const TextBase = ({
  title,
  children,
  numberOfLines,
  fontSize = 16,
  fontWeight = "400",
  textAlign = "left",
  marginBottom = 0,
  color,
  style,
  ...props
}: Props) => {
  const theme = useTheme();
  const { colors } = theme;
  const _color = colors?.[color] || colors.textOpacity8;

  const fontFamily = useMemo(() => {
    switch (fontWeight) {
      case "400":
        return "SVN-Outfit-Regular";
        break;
      case "500":
        return "SVN-Outfit-Medium";
        break;
      case "600":
        return "SVN-Outfit-SemiBold";
        break;
      case "700":
        return "SVN-Outfit-Bold";
        break;
      default:
        return "SVN-Outfit-Regular";
        break;
    }
  }, [fontWeight]);

  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines || 1}
      style={[
        {
          color: _color,
          includeFontPadding: false,
          textAlign,
          fontWeight,
          fontFamily,
          fontSize,
        },
        !!style && style,
      ]}
      {...props}
    >
      {title || ""}
      {children}
    </Text>
  );
};

export default memo(TextBase);
