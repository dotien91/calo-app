import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Video from "react-native-video";

import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CommonStyle from "@theme/styles";

interface IVideoPlayer {
  mediaUrl: string;
  resizeMode?: string | "cover";
  width: number;
  height: number;
}

const VideoPlayer = ({ mediaUrl, resizeMode, width, height }: IVideoPlayer) => {
  const refVideo = useRef<Video>();
  const animationBackRef = useRef<Lottie>(null);

  const [pause, setPause] = useState(true);

  useEffect(() => {
    if (animationBackRef.current) {
      animationBackRef.current.play(20, 20);
    }
  }, []);

  const switchPause = useCallback(() => {
    setPause((old) => !old);
  }, []);

  return (
    <Pressable
      style={{ ...styles.container, width, height }}
      onPress={switchPause}
    >
      <Video
        source={{ uri: mediaUrl }}
        ref={refVideo}
        repeat
        paused={pause}
        disableFocus
        resizeMode={resizeMode}
        style={styles.backgroundVideo}
      />
      {pause && (
        <View style={styles.wrapIcon}>
          <Icon
            type={IconType.Ionicons}
            name={"play"}
            size={18}
            color={palette.white}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
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
  wrapIcon: {
    backgroundColor: palette.primary,
    width: 30,
    height: 30,
    borderRadius: 99,
    ...CommonStyle.flexCenter,
    paddingLeft: 3,
  },
});

export default memo(VideoPlayer);
