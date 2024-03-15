import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import TrackPlayer, { useProgress } from "react-native-track-player";
import * as Progress from "react-native-progress";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import PressableBtn from "@shared-components/button/PressableBtn";
import eventEmitter from "@services/event-emitter";
import { setupPlayer } from "react-native-track-player/lib/trackPlayer";
import { uniqueId } from "lodash";
import { addTracks } from "@services/audio/TrackPlayerService";

interface ISoundPlayer {
  url: string;
  disabled?: boolean;
}

const SoundPlayer = ({ url, disabled = false }: ISoundPlayer) => {
  console.log("urlurl", url);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // const start = async () => {
  //     // Set up the player
  //     await TrackPlayer.setupPlayer();

  //     // Add a track to the queue
  //     await TrackPlayer.add({
  //         id: 'trackId',
  //         url,
  //     });

  //     // Start playing it
  //     await TrackPlayer.play();
  // };

  const onPause = () => {
    TrackPlayer.pause();
    setIsPlaying(false);
  };

  const onPlay = () => {
    if (progress.position > 0 && progress.position == progress.duration) {
      TrackPlayer.seekTo(0);
    }
    TrackPlayer.play();
    setIsPlaying(true);
  };

  const fancyTimeFormat = (duration: number) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
  };

  const initPlayer = async () => {
    await setupPlayer();
    const track1 = {
      url: url, // Load media from the network
      id: uniqueId(),
      // title: 'Avaritia',
      // artist: 'deadmau5',
      // album: 'while(1<2)',
      // genre: 'Progressive House, Electro House',
      // date: '2014-05-20T07:00:00+00:00', // RFC 3339
      // artwork: 'http://example.com/cover.png', // Load artwork from the network
      // duration: 402 // Duration in seconds
    };
    console.log(222222, url);
    addTracks(track1);
    // await TrackPlayer.add(1][track);
    setIsReady(true);
    if (disabled) {
      setIsPlaying(true);
      TrackPlayer.play();
    }
  };

  useEffect(() => {
    initPlayer();
    eventEmitter.on("stopRecordingPratice", _stopPlay);
    return () => {
      TrackPlayer.stop();
      eventEmitter.off("stopRecordingPratice", _stopPlay);
    };
  }, []);

  const _stopPlay = () => {
    TrackPlayer.stop();
    setIsPlaying(false);
  };

  const progress = useProgress();

  useEffect(() => {
    console.log("progressprogress", progress);
    if (disabled) return;
    if (progress.position > 0 && progress.position == progress.duration) {
      // TrackPlayer.seekTo(0);
      setIsPlaying(false);
    }
  }, [progress]);

  return (
    <>
      <View style={styles.box}>
        {isPlaying ? (
          <PressableBtn disabled={disabled || !isReady} onPress={onPause}>
            <Icon
              size={24}
              type={IconType.Ionicons}
              name={"pause"}
              color={palette.placeholder}
              style={{ marginRight: 6, opacity: isReady ? 1 : 0.3 }}
            />
          </PressableBtn>
        ) : (
          <PressableBtn onPress={onPlay} disabled={disabled || !isReady}>
            <Icon
              size={24}
              type={IconType.Ionicons}
              name={"play"}
              color={palette.placeholder}
              style={{ marginRight: 6, opacity: isReady ? 1 : 0.3 }}
            />
          </PressableBtn>
        )}
        <TextBase fontSize={12} style={{ width: 28, textAlign: "left" }}>
          {fancyTimeFormat(progress.position)}
        </TextBase>
        <Progress.Bar
          animationType={"timing"}
          progress={
            (progress.position / progress.duration > 0.95
              ? 1
              : progress.position / progress.duration) || 0
          }
          width={Device.width - 120}
          color={palette.primary}
          unfilledColor={palette.grey3}
          borderWidth={0}
          height={10}
          borderRadius={8}
          style={{ marginHorizontal: 4 }}
          useNativeDriver={true}
        ></Progress.Bar>
        <TextBase style={{ width: 28, textAlign: "right" }} fontSize={12}>
          {fancyTimeFormat(progress.buffered - progress.position)}
        </TextBase>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    ...CS.flexRear,
    paddingHorizontal: 16,
    marginTop: 12,
  },
});

export default React.memo(SoundPlayer);
