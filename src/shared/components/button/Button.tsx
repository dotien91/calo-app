import React, { useMemo } from "react";
import { View, Text, Pressable, ViewStyle, ColorValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";

interface ButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  SvgSo?: React.JSX.Element;
}

export default function Button({
  text,
  onPress,
  style,
  backgroundColor,
  textColor,
  SvgSo,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={style}>
      <Pressable
        style={[
          styles.viewButton,
          !!backgroundColor && { backgroundColor: backgroundColor },
        ]}
        onPress={onPress}
      >
        {!!SvgSo && SvgSo}
        {!!SvgSo && <View style={{ width: 10 }} />}
        <Text style={[styles.textButton, !!textColor && { color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
