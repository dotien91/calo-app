import React, { memo } from "react";
import isEqual from "react-fast-compare";
import { mhs } from "utils/size";

import { Text, TextProps, TextStyle } from "react-native";
import { palette } from "@theme/themes";

interface Props extends TextProps {
  title?: string | string[];
  style?: TextStyle;
  numberOfLines?: number;
  fontSize?: number;
  fontWeight?:
    | "400"
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | undefined;
  color?: string;
  textAlign?: "center" | "left" | "right";
}

const TextBase = ({
  style,
  title,
  children,
  numberOfLines,
  fontSize = 14,
  fontWeight = "400",
  textAlign = "left",
  color,
  ...props
}: Props) => {
  const isBold =
    fontWeight === "600" ||
    fontWeight === "700" ||
    fontWeight === "900" ||
    fontWeight === "bold";
  const _color = color || palette.mainColor2;

  return (
    <Text
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      style={[
        {
          color: _color,
          includeFontPadding: false,
        },
        { textAlign },
        { fontWeight: fontWeight },
        {
          fontFamily: isBold ? "SVN-Outfit-Bold" : "SVN-Outfit-Regular",
        },
        style,
        {
          fontSize: mhs(style?.fontSize ? style?.fontSize : fontSize, 0.3),
        },
      ]}
      {...props}
    >
      {title || ""}
      {children}
    </Text>
  );
};

export default memo(TextBase, isEqual);
