import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  clamp,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

function ChatHeads({
  children,
}: React.PropsWithChildren<Record<never, never>>) {
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);

  type AnimatedGHContext = {
    startX: number;
    startY: number;
  };
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = transX.value;
      ctx.startY = transY.value;
    },
    onActive: (event, ctx) => {
      transX.value = ctx.startX + event.translationX;
      transY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      const width = windowWidth - 40; // minus margins & width
      const height = windowHeight - 100 - 40; // minus margins & height
      const toss = 0.2;
      const targetX = clamp(transX.value + toss * event.velocityX, 0, width);
      const targetY = clamp(transY.value + toss * event.velocityY, 0, height);
      // return;

      const top = targetY;
      const bottom = height - targetY;
      const left = targetX;
      const right = width - targetX;
      const minDistance = Math.min(top, bottom, left, right);
      let snapX = targetX;
      let snapY = targetY;
      switch (minDistance) {
        case top:
          snapY = 0;
          break;
        case bottom:
          snapY = height;
          break;
        case left:
          snapX = 0;
          break;
        case right:
          snapX = 0;
          break;
      }
      transX.value = withSpring(0, {
        velocity: event.velocityX,
      });
      transY.value = withSpring(snapY, {
        velocity: event.velocityY,
      });
    },
  });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: transX.value,
        },
        {
          translateY: transY.value,
        },
      ],
    };
  });

  const childrenArray = React.Children.toArray(children);

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.headContainer, stylez]}>
          {childrenArray[0]}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

export default function ChatHeadsExample() {
  return (
    <View style={styles.container}>
      <ChatHeads>
        <View style={[styles.head, styles.black]} />
      </ChatHeads>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  head: {
    width: SCREEN_WIDTH,
    height: 40,
  },
  headContainer: {
    position: "absolute",
    zIndex: -1,
  },
  black: { backgroundColor: "black" },
  blue: { backgroundColor: "blue" },
  green: { backgroundColor: "green" },
  yellow: { backgroundColor: "yellow" },
});
