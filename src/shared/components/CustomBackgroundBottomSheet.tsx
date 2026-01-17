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
  // Removed: react-native-reanimated functionality
  // Note: @gorhom/bottom-sheet requires reanimated, this component may not work correctly
  // const containerAnimatedStyle = useAnimatedStyle(() => ({
  //   backgroundColor: interpolateColor(
  //     animatedIndex.value,
  //     [0, 1],
  //     [colors.background, colors.background],
  //   ),
  // }));
  const containerStyle = useMemo(
    () => [style, { backgroundColor: colors.background }],
    [style, colors.background],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
