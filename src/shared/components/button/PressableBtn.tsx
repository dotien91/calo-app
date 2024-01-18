import React, { ReactNode } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

interface IPressableBtn {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const PressableBtn = ({ style, onPress, children }: IPressableBtn) => {
  return (
    <Pressable
      style={({ pressed }) => {
        return [{ opacity: pressed ? 0.5 : 1.0 }, style && style];
      }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default React.memo(PressableBtn);
