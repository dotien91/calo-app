import React, { useMemo } from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
// import Animated, {
//   useAnimatedStyle,
//   interpolateColor,
// } from "react-native-reanimated"; // Removed reanimated
import { Animated } from "react-native"; // Fallback - Note: @gorhom/bottom-sheet requires reanimated
import { useTheme } from "@react-navigation/native";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const theme = useTheme();
  const { colors } = theme;
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [colors.background, colors.background],
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
