import React, { useEffect } from "react";
import { View } from "react-native";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  useActiveTrack,
  useTrackPlayerEvents,
} from "react-native-track-player";

import useStore from "@services/zustand/store";

const AudioProgress = () => {
  const activeTrack = useActiveTrack();
  const updateAudio = useStore((store) => store.updateAudio);

  const updataDaPosition = (position: number, duration: number) => {
    if (activeTrack) {
      // console.log("activeTrack", activeTrack, position, duration);
      updateAudio({
        ...activeTrack,
        position: position,
        duration: duration,
      });
    }
  };

  useEffect(() => {
    TrackPlayer.setupPlayer()
      .then(() => {
        TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
          },
          // This flag is now deprecated. Please use the above to define playback mode.
          stoppingAppPausesPlayback: true,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
          ],
          progressUpdateEventInterval: 10,
        }).catch(console.log);
      })
      .catch(console.log);
  }, []);

  useTrackPlayerEvents(
    [Event.PlaybackProgressUpdated, Event.PlaybackState],
    async (event) => {
      switch (event.type) {
        case Event.PlaybackProgressUpdated:
          // not triggered on release build
          // updataDaPosition();
          // console.log("data111111111", event);
          // _setJson("is_first_open_app", JSON.stringify(event));
          updataDaPosition(event.position, event.duration);

          break;
        case Event.PlaybackState:
          // triggered
          // updataDaPosition();
          break;
      }
    },
  );

  return <View />;
};

export default AudioProgress;
