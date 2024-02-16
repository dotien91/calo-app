import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";

import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CommonStyle from "@theme/styles";

interface IVideoPlayer {
  mediaThumbail: string;
  mediaUrl: string;
  resizeMode?: string | "cover";
  width: number;
  height: number;
  pressable: boolean;
  autoPlay: boolean;
  repeat: boolean;
  onPress: () => void;
}

const VideoPlayer = ({
  mediaThumbail,
  mediaUrl,
  width,
  height,
  pressable = true,
  autoPlay,
  onPress,
  ...res
}: IVideoPlayer) => {
  const refVideo = useRef<Video>();
  const animationBackRef = useRef<Lottie>(null);

  const [pause, setPause] = useState(!autoPlay);

  useEffect(() => {
    if (animationBackRef.current) {
      animationBackRef.current.play(20, 20);
    }
  }, []);

  const switchPause = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    setPause((old) => !old);
  }, []);

  const Component = pressable ? Pressable : View;

  return (
    <Component
      style={{ ...styles.container, width, height }}
      onPress={switchPause}
    >
      {pause && (
        <Icon
          type={IconType.Ionicons}
          name={"play-circle"}
          size={40}
          color={palette.primary}
          style={[styles.icon, { top: height / 2 - 20 }]}
        />
      )}
      {!!mediaThumbail && (
        <FastImage
          style={{
            width,
            height,
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
          source={{ uri: mediaThumbail }}
        />
      )}
      <Video
        source={{ uri: mediaUrl }}
        ref={refVideo}
        paused={pause}
        style={styles.backgroundVideo}
        autoPlay={autoPlay}
        {...res}
      />
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.black,
    ...CommonStyle.flexCenter,
  },
  backgroundVideo: {
    backgroundColor: palette.black,
    position: "absolute",
    alignSelf: "center",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  icon: {
    position: "absolute",
    zIndex: 2,
  },
});

export default memo(VideoPlayer);
