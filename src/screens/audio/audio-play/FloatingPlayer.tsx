import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useActiveTrack, useIsPlaying } from "react-native-track-player";

import { palette } from "@theme/themes";
import React, { useEffect } from "react";
import CS from "@theme/styles";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import { useActionTrack } from "../hook/useActionTrack";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { MovingText } from "../components/MovingText";
import IconSvg from "assets/svg";
interface FloatingPlayerProps {
  onPressShow: () => void;
}

export const FloatingPlayer = ({ onPressShow }: FloatingPlayerProps) => {
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  // const handlePress = () => {
  //   // NavigationService.navigate(SCREENS.AUDIO_PLAY);
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.PlayPodcast,
  //     styleModalType: EnumStyleModalType.Full,
  //   });
  // };
  const { playing } = useIsPlaying();

  const rotation = useSharedValue(0);

  const startAnimation = () => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );
  };
  useEffect(() => {
    rotation.value = 0;
    if (playing) {
      startAnimation();
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [playing]);

  const { pause, stop } = useActionTrack();

  if (!displayedTrack) return null;

  const RenderAvatar = () => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });
    return (
      <Animated.View style={[styles.trackArtworkImage, animatedStyle]}>
        <FastImage
          source={{
            uri: displayedTrack.artwork,
          }}
          style={styles.trackArtworkImage}
        />
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      style={{ backgroundColor: palette.mainColor2 }}
      source={{ uri: displayedTrack.artwork }}
      blurRadius={100}
    >
      <View style={styles.overlay} />
      <TouchableOpacity
        onPress={onPressShow}
        activeOpacity={0.95}
        style={[styles.container]}
      >
        <>
          <RenderAvatar />

          <View style={styles.trackTitleContainer}>
            <MovingText
              style={styles.txtTitle}
              animationThreshold={25}
              text={displayedTrack.title ?? ""}
            />
            <Text style={styles.txtArtist} numberOfLines={1}>
              {displayedTrack.artist}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.trackControlsContainer}
            onPressIn={pause}
          >
            <IconSvg
              name={playing ? "icPauseAudio" : "icPlayAudio"}
              size={32}
              color={palette.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trackControlsContainer}
            onPressIn={stop}
          >
            <IconSvg name={"icClose"} size={28} color={palette.white} />
          </TouchableOpacity>
        </>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
    height: 74,
    borderBottomColor: palette.borderColor,
    borderBottomWidth: 1,
    ...CS.flexRear,
  },
  trackArtworkImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: "hidden",
    marginLeft: 10,
  },
  trackControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  txtTitle: {
    ...CS.hnMedium,
    color: palette.white,
  },
  txtArtist: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.white,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "#484d49",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    opacity: 0.3,
  },
});
