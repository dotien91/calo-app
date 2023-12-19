import React, { useMemo } from "react";
import { View, Text, Pressable, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";

interface ButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
}

export default function Button({ text, onPress, style }: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={style}>
      <Pressable style={styles.viewButton} onPress={onPress}>
        <Text style={styles.textButton}>{text}</Text>
      </Pressable>
    </View>
  );
}
