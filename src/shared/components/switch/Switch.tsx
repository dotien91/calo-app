import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
// import Animated, {
//   interpolate,
//   interpolateColor,
//   runOnJS,
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated"; // Removed reanimated
// import { clamp, snapPoint } from "react-native-redash"; // Removed (depends on reanimated)
import { Animated } from "react-native"; // Fallback to React Native Animated
import { scale } from "react-native-size-matters";
import { useMemo } from "use-memo-one";

type SwitchComponentProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  labelContainer: React.ReactNode;
  backgroundColor: string;
};
const SWITCH_CONTAINER_WIDTH = scale(50);
const SWITCH_CONTAINER_HEIGHT = scale(26);
const CIRCLE_WIDTH = scale(24);
const BORDER = scale(1);
// const DEFAULT_MARGIN = scale(10);
const TRACK_CIRCLE_WIDTH = SWITCH_CONTAINER_WIDTH - CIRCLE_WIDTH - BORDER * 2;
const config: Animated.WithSpringConfig = {
  overshootClamping: true,
};
const SwitchComponent = ({ value, onChange }: SwitchComponentProps) => {
  const [isToggled, setIsToggled] = useState(value);
  // Removed: react-native-reanimated functionality
  // const translateX = useSharedValue(!value ? 0 : TRACK_CIRCLE_WIDTH);
  const translateX = useRef(new Animated.Value(!value ? 0 : TRACK_CIRCLE_WIDTH)).current;
  
  useEffect(() => {
    setTimeout(() => {
      onChange(isToggled);
    }, 100);
  }, [isToggled]);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isToggled ? TRACK_CIRCLE_WIDTH : 0,
      useNativeDriver: false,
      ...config,
    }).start();
  }, [isToggled]);

  const onPress = ({
    nativeEvent: { state },
  }: TapGestureHandlerStateChangeEvent) => {
    if (state !== State.ACTIVE) return;
    setIsToggled((prevstate) => !prevstate);
    // Removed: react-native-reanimated functionality
    // translateX.value = withSpring(isToggled ? 0 : TRACK_CIRCLE_WIDTH, config);
  };

  // Removed: react-native-reanimated functionality
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateX: translateX.value }],
  //     width: interpolate(
  //       translateX.value,
  //       [0, TRACK_CIRCLE_WIDTH / 3, TRACK_CIRCLE_WIDTH],
  //       [CIRCLE_WIDTH, (CIRCLE_WIDTH / 2) * 2.5, CIRCLE_WIDTH],
  //     ),
  //   };
  // });
  // const animatedContainerStyle = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: interpolateColor(
  //       translateX.value,
  //       [0, TRACK_CIRCLE_WIDTH],
  //       ["white", palette.primary],
  //     ),
  //   };
  // });

  const animatedStyle = {
    transform: [{ translateX }],
    width: CIRCLE_WIDTH,
  };

  const animatedContainerStyle = {
    backgroundColor: isToggled ? palette.primary : "white",
  };

  const animatedStyles = useMemo(() => animatedContainerStyle, [isToggled]);

  // Removed: react-native-reanimated gesture handler
  // const onGestureEvent = useAnimatedGestureHandler<
  //   PanGestureHandlerGestureEvent,
  //   { x: number }
  // >({
  //   onStart: (_e, ctx) => {
  //     ctx.x = translateX.value;
  //   },
  //   onActive: ({ translationX }, ctx) => {
  //     translateX.value = clamp(translationX + ctx.x, 0, TRACK_CIRCLE_WIDTH);
  //   },
  //   onEnd: ({ velocityX }) => {
  //     const selectedSnapPoint = snapPoint(translateX.value, velocityX, [
  //       0,
  //       TRACK_CIRCLE_WIDTH,
  //     ]);
  //     translateX.value = withSpring(selectedSnapPoint, config);
  //     runOnJS(setIsToggled)(selectedSnapPoint !== 0);
  //   },
  // });

  const panRef = useRef<PanGestureHandler>(null);

  return (
    <TapGestureHandler waitFor={panRef} onHandlerStateChange={onPress}>
      <Animated.View style={[animatedStyles, styles.switchContainer]}>
        {/* Removed: Pan gesture handler - react-native-reanimated functionality */}
        {/* <PanGestureHandler ref={panRef} onGestureEvent={onGestureEvent}> */}
          <Animated.View
            style={[
              animatedStyle,
              styles.circle,
              { borderColor: "transparent" },
            ]}
          />
        {/* </PanGestureHandler> */}
      </Animated.View>
    </TapGestureHandler>
  );
};
export default SwitchComponent;

const styles = StyleSheet.create({
  switchContainer: {
    width: SWITCH_CONTAINER_WIDTH,
    height: SWITCH_CONTAINER_HEIGHT,
    borderRadius: 999,
    flexDirection: "row",
  },
  circle: {
    alignSelf: "center",
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: 999,
    borderWidth: BORDER,
    elevation: 18,
    backgroundColor: "white",
  },
});
