import React, { useEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { clamp, snapPoint } from "react-native-redash";
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
const SwitchComponent = ({
  value,
  onChange,
  backgroundColor,
}: SwitchComponentProps) => {
  const [isToggled, setIsToggled] = useState(value);
  const translateX = useSharedValue(!value ? 0 : TRACK_CIRCLE_WIDTH);
  useEffect(() => {
    setTimeout(() => {
      onChange(isToggled);
    }, 100);
  }, [isToggled]);
  const onPress = ({
    nativeEvent: { state },
  }: TapGestureHandlerStateChangeEvent) => {
    if (state !== State.ACTIVE) return;
    setIsToggled((prevstate) => !prevstate);
    translateX.value = withSpring(isToggled ? 0 : TRACK_CIRCLE_WIDTH, config);
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: interpolate(
        translateX.value,
        [0, TRACK_CIRCLE_WIDTH / 3, TRACK_CIRCLE_WIDTH],
        [CIRCLE_WIDTH, (CIRCLE_WIDTH / 2) * 2.5, CIRCLE_WIDTH],
      ),
    };
  });
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, TRACK_CIRCLE_WIDTH],
        ["white", backgroundColor],
      ),
    };
  });

  const animatedStyles = useMemo(() => animatedContainerStyle, []);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_e, ctx) => {
      ctx.x = translateX.value;
    },
    onActive: ({ translationX }, ctx) => {
      translateX.value = clamp(translationX + ctx.x, 0, TRACK_CIRCLE_WIDTH);
    },
    onEnd: ({ velocityX }) => {
      const selectedSnapPoint = snapPoint(translateX.value, velocityX, [
        0,
        TRACK_CIRCLE_WIDTH,
      ]);
      translateX.value = withSpring(selectedSnapPoint, config);
      runOnJS(setIsToggled)(selectedSnapPoint !== 0);
    },
  });

  const panRef = useRef<PanGestureHandler>(null);

  return (
    <TapGestureHandler waitFor={panRef} onHandlerStateChange={onPress}>
      <Animated.View style={[animatedStyles, styles.switchContainer]}>
        <PanGestureHandler ref={panRef} onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[
              animatedStyle,
              styles.circle,
              { borderColor: "transparent" },
            ]}
          />
        </PanGestureHandler>
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
