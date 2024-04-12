import * as React from "react";
import { StyleSheet } from "react-native";

import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";

interface IconSvgBtnProps {
  size: number;
  name: string;
  color: string;
  onPress: () => void;
}

const IconSvgBtn = ({ size, name, color, onPress }: IconSvgBtnProps) => {
  return (
    <PressableBtn
      onPress={onPress}
      style={[styles.container, { width: size, height: size }]}
    >
      <IconSvg size={size} name={name} color={color} />
    </PressableBtn>
  );
};

export default IconSvgBtn;

const styles = StyleSheet.create({
  container: {},
});
