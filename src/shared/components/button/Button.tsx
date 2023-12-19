import React, { useMemo } from "react";
import { View, Text, Pressable, ViewStyle, ColorValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";
import { SvgProps } from "react-native-svg";

interface ButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  SvgSo?: React.FC<SvgProps>;
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
        {!!SvgSo && <SvgSo style={{ marginRight: 12 }} color={textColor} />}
        <Text style={[styles.textButton, !!textColor && { color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}
