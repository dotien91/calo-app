import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface Props extends FastImageProps {
  width?: number;
  height?: number;
  onPress?: () => void;
  style?: any;
  borderRadius?: number;
  isAvatar?: boolean;
}
const HIT_SLOP_EXPAND_20 = { top: 20, left: 20, right: 20, bottom: 20 };

const ImageLoad = (props: Props) => {
  const {
    width,
    isAvatar = true,
    height,
    style,
    onLoad,
    onPress,
    source,
    onLoadStart,
    borderRadius = 0,
    ...rest
  } = props;
  const _borderRadius = borderRadius || style?.borderRadius || 0;

  const loaded = useSharedValue(0);

  useEffect(() => {
    if (
      (typeof source === "object" && source?.uri) ||
      typeof source !== "object"
    ) {
      loaded.value = withDelay(5000, withTiming(1, { duration: 2000 }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loaded.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    };
  });

  const blurhashStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(loaded.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    };
  });

  const ViewComponent = onPress ? Pressable : View;

  return (
    <ViewComponent
      style={[
        style,
        width ? { width } : {},
        height ? { height } : {},
        { overflow: "hidden", borderRadius: _borderRadius },
      ]}
      onPress={() => {
        onPress?.();
      }}
      hitSlop={HIT_SLOP_EXPAND_20}
    >
      <Animated.View style={[StyleSheet.absoluteFillObject, blurhashStyle]}>
        <FastImage
          source={
            isAvatar
              ? require("assets/images/default_avatar.jpg")
              : require("assets/images/defaultCover.jpg")
          }
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>
      {(typeof source === "object" && source?.uri) ||
      typeof source !== "object" ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { zIndex: 100 },
            animatedStyle,
          ]}
        >
          <FastImage
            onLoadStart={() => {
              loaded.value = withTiming(0, { duration: 500 });
              onLoadStart?.();
            }}
            onLoad={(evt) => {
              loaded.value = withTiming(1, { duration: 500 });
              onLoad?.(evt);
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: borderRadius,
            }}
            resizeMode="cover"
            source={source}
            {...rest}
          />
        </Animated.View>
      ) : null}
    </ViewComponent>
  );
};

export default React.memo(ImageLoad);
