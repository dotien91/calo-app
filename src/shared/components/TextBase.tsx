import React, { memo, useMemo } from "react";

import { Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";

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

const TextBase = ({
  title,
  children,
  fontSize = 16,
  fontWeight = "400",
  textAlign = "left",
  marginBottom = 0,
  color,
  style,
  ...props
}: Props) => {
  const theme = useTheme();
  const colors = theme?.colors ?? palette;
  const _color = (color && (colors as Record<string, string>)[color]) ?? (colors as Record<string, string>).textOpacity9 ?? palette.textOpacity9;

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
      style={[
        {
          color: _color,
          includeFontPadding: false,
          textAlign,
          fontWeight,
          lineHeight: fontSize + 8,
          fontFamily,
          fontSize,
          marginBottom,
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
