import React from "react";

import { HIT_SLOP_EXPAND_20 } from "../../constants/system.constant";
import { ImageBackground, Pressable } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Shadow3 } from "../../ui/shadow.ui";

interface Props extends FastImageProps {
  width?: any;
  height?: any;
  onPress?: () => void;
  style?: any;
  onLoad?: any;
  source?: any;
}

const ImageLoad = (props: Props) => {
  const { width, height, style, onLoad, onPress, source, ...rest } = props;

  const loaded = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loaded.value ? 1 : 0, { duration: 400 }),
      transform: [
        {
          scale: withTiming(loaded.value ? 1 : 0, { duration: 300 }),
        },
      ],
    };
  });

  console.log(source, "source");

  return (
    <Pressable
      onPress={() => {
        onPress?.();
      }}
      hitSlop={HIT_SLOP_EXPAND_20}
    >
      <ImageBackground
        source={require("../../assets/images/avatar_default.png")}
        style={[
          style,
          width ? { width } : {},
          height ? { height } : {},
          {
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            ...Shadow3,
          },
        ]}
      >
        <Animated.View style={[animatedStyle]}>
          <FastImage
            onLoad={(evt: any) => {
              onLoad?.(evt);
              loaded.value = true;
            }}
            style={[width ? { width } : {}, height ? { height } : {}]}
            source={source}
            {...rest}
          />
        </Animated.View>
      </ImageBackground>
    </Pressable>
  );
};

export default ImageLoad;
