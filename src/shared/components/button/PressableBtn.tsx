import React, { useMemo } from "react";
import { Pressable, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";

interface IPressableBtn {
  onPress: () => void;
  customStyle?: ViewStyle;
  children: () => React.JSX.Element;
}

const PressableBtn = ({ customStyle, onPress, children }: IPressableBtn) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      style={({ pressed }) => {
        return [
          styles.pressableBtn,
          { opacity: pressed ? 0.5 : 1.0 },
          customStyle && customStyle,
        ];
      }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default React.memo(PressableBtn);
