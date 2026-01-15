import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withTiming,
// } from "react-native-reanimated"; // Removed reanimated
import { Animated } from "react-native"; // Fallback to React Native Animated

interface Props extends FastImageProps {
  width?: number;
  height?: number;
  onPress?: () => void;
  style?: any;
  borderRadius?: number;
  isAvatar?: boolean;
  showImageDefault?: boolean;
}
const HIT_SLOP_EXPAND_20 = { top: 20, left: 20, right: 20, bottom: 20 };

const ImageLoad = (props: Props) => {
  const {
    width,
    isAvatar = false,
    height,
    style,
    onLoad,
    onPress,
    source,
    onLoadStart,
    showImageDefault = true,
    borderRadius = 0,
    ...rest
  } = props;
  const _borderRadius = borderRadius || style?.borderRadius || 0;

  const loaded = useSharedValue(0);
  const [loading, setLoading] = React.useState(false);

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
      {showImageDefault && (
        <Animated.View style={[StyleSheet.absoluteFillObject, blurhashStyle]}>
          <FastImage
            source={
              isAvatar
                ? require("assets/images/default_avatar.jpg")
                : require("assets/images/defaultCover.png")
            }
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
      )}
      {loading && (
        <ActivityIndicator
          animating
          color={"white"}
          style={{
            flex: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 1,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      )}
      {source?.uri ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { zIndex: 100 },
            animatedStyle,
          ]}
        >
          <FastImage
            onLoadStart={() => {
              setLoading(true);
              loaded.value = withTiming(0, { duration: 500 });
              onLoadStart?.();
            }}
            onLoadEnd={() => setLoading(false)}
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
