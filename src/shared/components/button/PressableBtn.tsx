import React, { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

interface IPressableBtn extends PressableProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  disable?: boolean;
}

const PressableBtn = ({
  style,
  onPress,
  children,
  disable = false,
}: IPressableBtn) => {
  return (
    <Pressable
      disabled={disable}
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
