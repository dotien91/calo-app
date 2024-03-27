import React, { useCallback, useRef, useState, memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
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
  wrapStyle?: ViewStyle;
  isStreamThumbnail?: boolean;
}

const VideoPlayer = ({
  wrapStyle,
  mediaThumbail,
  mediaUrl,
  width,
  height,
  pressable = true,
  autoPlay,
  onPress,
  isStreamThumbnail,
  ...res
}: IVideoPlayer) => {
  const refVideo = useRef<Video>();

  const [pause, setPause] = useState(!autoPlay && !isStreamThumbnail);
  const [isPreloading, setIsPreloading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(false);

  React.useEffect(() => {
    if (isStreamThumbnail && !isPreloading) {
      setPause((old) => !old);
      setShowThumbnail(false);
    }
  }, [isStreamThumbnail, isPreloading]);

  const switchPause = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    setPause((old) => !old);
  }, []);

  const load = () => {
    refVideo.current.seek(11);
  }; // n

  const Component = pressable ? Pressable : View;

  return (
    <Component
      style={{ ...styles.container, width, height, ...wrapStyle }}
      onPress={switchPause}
    >
      {(pause || isStreamThumbnail) && (
        <Icon
          type={IconType.Ionicons}
          name={"play-circle"}
          size={40}
          color={palette.white}
          style={[styles.icon, { top: height / 2 - 20 }]}
        />
      )}
      {showThumbnail && !!mediaThumbail && (
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
      {!isStreamThumbnail && isPreloading && (
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
      <Video
        source={{ uri: mediaUrl }}
        ref={refVideo}
        paused={pause}
        style={styles.backgroundVideo}
        autoPlay={isStreamThumbnail || autoPlay}
        onLoadStart={() => {
          setIsPreloading(true);
        }}
        onLoad={load}
        useNativeControls
        onReadyForDisplay={() => setIsPreloading(false)}
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
