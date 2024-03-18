import React from "react";
import { ActivityIndicator } from "react-native";
import Animated, {
  cancelAnimation,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { RefreshControlProps } from "react-native-head-tab-view";
const config = {
  duration: 1000,
  easing: Easing.linear,
};

const CustomRefreshControl: React.FC<RefreshControlProps> = ({
  refreshType,
  progress,
}) => {
  const rotateValue = useSharedValue("0deg");

  useAnimatedReaction(
    () => {
      return refreshType.value === "refreshing";
    },
    (isStart) => {
      if (!isStart) return;
      cancelAnimation(rotateValue);
      rotateValue.value = "0deg";
      rotateValue.value = withRepeat(
        withTiming(`${360}deg`, config),
        -1,
        false,
      );
    },
  );

  useAnimatedReaction(
    () => {
      return refreshType.value === "finish";
    },
    (isStart) => {
      if (!isStart) return;
      cancelAnimation(rotateValue);
    },
  );

  useAnimatedReaction(
    () => {
      return refreshType.value === "pullToRefresh" && progress;
    },
    (isStart) => {
      if (!isStart) return;
      rotateValue.value = `${progress.value * 360}deg`;
    },
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={"large"} />
    </Animated.View>
  );
};

export default CustomRefreshControl;
