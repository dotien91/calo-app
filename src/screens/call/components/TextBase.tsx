import React, { PureComponent } from "react";

import { StyleProp, Text, TextProps } from "react-native";

interface Props extends TextProps {
  title?: string | string[];
  style?: StyleProp<any>;
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

class TextBase extends PureComponent<Props> {
  render() {
    const {
      style,
      title,
      children,
      numberOfLines,
      fontSize = 14,
      fontWeight = "400",
      textAlign = "left",
    } = this.props;

    const isBold =
      fontWeight == "600" ||
      fontWeight == "700" ||
      fontWeight == "900" ||
      fontWeight == "bold";
    const color = this.props.color || "#474747";
    return (
      <Text
        {...this.props}
        allowFontScaling={false}
        numberOfLines={numberOfLines}
        style={[
          {
            fontSize: fontSize,
            color,
            includeFontPadding: false,
          },
          { textAlign },
          { fontWeight: fontWeight },
          {
            fontFamily: isBold ? "SVN-Outfit-Bold" : "SVN-Outfit-Regular",
          },
          style,
        ]}
      >
        {title || ""}
        {children}
      </Text>
    );
  }
}

export default TextBase;
