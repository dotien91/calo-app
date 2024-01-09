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
  autoPlay: boolean;
}

const VideoPlayer = ({
  mediaUrl,
  resizeMode,
  width,
  height,
  autoPlay,
}: IVideoPlayer) => {
  const refVideo = useRef<Video>();
  const [pause, setPause] = useState(!autoPlay);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      refVideo.current.stop();
    };
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
            size={width / 10}
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
    borderRadius: 99,
    ...CommonStyle.flexCenter,
    padding: 10,
  },
});

export default memo(VideoPlayer);
