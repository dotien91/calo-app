// import { useEffect } from "react";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from "react-native-track-player";

import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import { useEffect, useState } from "react";

export const useActionTrack = () => {
  const activeTrack = useActiveTrack();
  const progress = useProgress();
  const { playing } = useIsPlaying();
  const updateAudio = useStore((store) => store.updateAudio);
  const [isFirst, setIsFirt] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [rate, setRate] = useState(1.0);

  const updataDaPosition = async () => {
    if (activeTrack) {
      await updateAudio({
        ...activeTrack,
        position: progress.position,
        duration: progress.duration,
      });
    }
  };

  useEffect(() => {
    checkIndexTrack();
  }, [activeTrack]);

  const checkIndexTrack = async () => {
    const index = await TrackPlayer.getActiveTrackIndex();
    const length = (await TrackPlayer.getQueue()).length;
    if (index == 0) {
      setIsFirt(true);
    } else {
      setIsFirt(false);
    }
    if (index == length - 1) {
      setIsLast(true);
    } else {
      setIsLast(false);
    }
  };

  const next = async () => {
    updataDaPosition();
    const index = await TrackPlayer.getActiveTrackIndex();
    const length = (await TrackPlayer.getQueue()).length;
    console.log(index, length);
    if (index < length - 1) {
      TrackPlayer.skipToNext();
    }
  };

  const previous = async () => {
    updataDaPosition();
    const index = await TrackPlayer.getActiveTrackIndex();
    console.log(index);
    if (index > 0) {
      TrackPlayer.skipToPrevious();
    }
  };

  const pause = async () => {
    if (playing) {
      TrackPlayer.pause();
      updataDaPosition();
    } else {
      if (progress.position + 2 >= progress.duration) {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      } else {
        TrackPlayer.play();
      }
    }
  };

  const forWard = async () => {
    updataDaPosition();
    if (progress.position + 10 < progress.duration) {
      await TrackPlayer.seekTo(progress.position + 10);
    } else {
      await TrackPlayer.seekTo(progress.duration - 5);
    }
  };

  const backWard = async () => {
    // -10s
    updataDaPosition();
    if (progress.position - 10 > 0) {
      await TrackPlayer.seekTo(progress.position - 10);
    } else {
      await TrackPlayer.seekTo(0);
    }
  };

  const stop = async () => {
    eventEmitter.emit("floating_play", { show: false });
    updataDaPosition();
    const track = {
      // url: "https://files.exam24h.com/upload/2024/05/10_1715327584971/661768ce52c681916687c57c/sound.m4a",
      url: "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3",
      title: "",
      artist: "",
      artwork: "",
    };
    await TrackPlayer.reset();
    await TrackPlayer.seekBy(1);
    await TrackPlayer.add(track);
    await TrackPlayer.play();
    await TrackPlayer.stop();
  };

  return {
    next,
    previous,
    pause,
    forWard,
    backWard,
    stop,
    updataDaPosition,
    isFirst,
    isLast,
    rate,
    setRate,
  };
};
