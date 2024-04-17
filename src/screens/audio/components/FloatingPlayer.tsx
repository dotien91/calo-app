import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useActiveTrack, useIsPlaying } from "react-native-track-player";
import * as NavigationService from "react-navigation-helpers";

import IconSvgBtn from "./IconSvgBtn";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import React, { useEffect } from "react";
import eventEmitter from "@services/event-emitter";
import CS from "@theme/styles";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import { MovingText } from "./MovingText";
import { useActionTrack } from "../hook/useActionTrack";
import { getBottomSpace } from "react-native-iphone-screen-helper";

export const FloatingPlayer = ({ style }: ViewProps) => {
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  const [showFloating, setShowFloating] = React.useState(false);
  const handlePress = () => {
    NavigationService.navigate(SCREENS.AUDIO_PLAY);
  };
  const { playing } = useIsPlaying();

  const checkScreenAudio = ({ show }) => {
    setShowFloating(show);
  };

  useEffect(() => {
    eventEmitter.on("floating_play", checkScreenAudio);
    return () => {
      eventEmitter.off("floating_play", checkScreenAudio);
    };
  }, []);
  const { pause, stop } = useActionTrack();

  if (!displayedTrack || !showFloating) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
      <>
        <FastImage
          source={{
            uri: displayedTrack.artwork,
          }}
          style={styles.trackArtworkImage}
        />

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

        <View style={styles.trackControlsContainer}>
          <IconSvgBtn
            name={playing ? "icPauseAudio" : "icPlayAudio"}
            size={32}
            color={palette.primary}
            onPress={pause}
          />
        </View>
        <View style={styles.trackControlsContainer}>
          <IconSvgBtn
            name={"icClose"}
            size={28}
            color={palette.primary}
            onPress={stop}
          />
        </View>
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    height: 74,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    elevation: 5,
    shadowRadius: 5,
    ...CS.flexRear,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: getBottomSpace() + 52,
  },
  trackArtworkImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "red",
  },
  trackTitleContainer: {
    flex: 1,
    overflow: "hidden",
    marginLeft: 10,
  },
  trackControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  txtTitle: {
    ...CS.hnMedium,
  },
  txtArtist: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity4,
  },
});
