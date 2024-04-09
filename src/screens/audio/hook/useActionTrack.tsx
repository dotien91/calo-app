import useStore from "@services/zustand/store";
import { useEffect } from "react";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from "react-native-track-player";

export const useActionTrack = () => {
  const activeTrack = useActiveTrack();
  const progress = useProgress();
  const { playing } = useIsPlaying();
  const updateAudio = useStore((store) => store.updateAudio);

  const updataDaPosition = () => {
    if (activeTrack && progress.position % 15 > 14) {
      updateAudio({
        ...activeTrack,
        position: progress.position,
        duration: progress.duration,
      });
    }
  };

  useEffect(() => {
    updataDaPosition();
  }, [progress.position]);

  const next = () => {
    updataDaPosition();
    TrackPlayer.skipToNext();
  };

  const previous = () => {
    updataDaPosition();
    TrackPlayer.skipToPrevious();
  };

  const pause = async () => {
    if (playing) {
      TrackPlayer.pause();
      updataDaPosition();
    } else {
      if (progress.position >= progress.duration) {
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
    await TrackPlayer.reset();
  };

  return {
    next,
    previous,
    pause,
    forWard,
    backWard,
    stop,
    updataDaPosition,
  };
};
