import React, { ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

interface IPressableBtn extends PressableProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  disable?: boolean;
}

<<<<<<< HEAD
const PressableBtn = ({ style, onPress, children, ...res }: IPressableBtn) => {
  return (
    <Pressable
      {...res}
=======
const PressableBtn = ({
  style,
  onPress,
  children,
  disable = false,
}: IPressableBtn) => {
  return (
    <Pressable
      disabled={disable}
>>>>>>> 207ab41 (feat: course preview)
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
