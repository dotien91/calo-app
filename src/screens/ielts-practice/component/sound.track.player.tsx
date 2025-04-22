import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import TrackPlayer, { useProgress } from "react-native-track-player";
import dayjs from "dayjs";
import * as Progress from "react-native-progress";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";

const SoundTrackPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const { position, duration } = useProgress(); // update mỗi 250ms

  useEffect(() => {
    const setup = async () => {
      try {
        await TrackPlayer.reset();
        const track = {
          url: audioUrl,
          title: "trackId1",
          artist: "ikes",
          artwork: "ikes",
          id: "ikes",
        };
        console.log("soundTrackPlayer.1..", audioUrl);

        await TrackPlayer.add(track);

        await TrackPlayer.play();
      } catch (err) {
        console.log("TrackPlayer error:", err);
      }
    };

    setup();

    return () => {
      const cleanup = async () => {
        await TrackPlayer.stop();
        await TrackPlayer.reset();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
        });
      };

      cleanup();
    };
  }, []);

  const formatTime = (seconds) =>
    dayjs().startOf("day").second(seconds).format("mm:ss");

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.box}>
      <TextBase fontSize={12} style={{ width: 35, textAlign: "left" }}>
        {formatTime(position)}
      </TextBase>
      <Progress.Bar
        animationType={"timing"}
        progress={progress}
        width={Device.width - 130}
        color={palette.primary}
        unfilledColor={palette.grey3}
        borderWidth={0}
        height={10}
        borderRadius={8}
        style={{ marginHorizontal: 4 }}
        useNativeDriver={true}
      ></Progress.Bar>
      <TextBase fontSize={12} style={{ width: 35, textAlign: "right" }}>
        {formatTime(duration)}
      </TextBase>
    </View>
  );
};

export default SoundTrackPlayer;

const styles = StyleSheet.create({
  box: {
    ...CS.flexRear,
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
