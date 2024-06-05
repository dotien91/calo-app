// import { useEffect } from "react";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from "react-native-track-player";

import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import { useEffect, useState } from "react";
import { GetPodCastSuggest } from "@services/api/podcast.api";

export const useActionTrack = () => {
  const activeTrack = useActiveTrack();
  const progress = useProgress();
  const { playing } = useIsPlaying();
  const updateAudio = useStore((store) => store.updateAudio);
  const [isFirst, setIsFirt] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [rate, setRate] = useState(1.0);
  const id = activeTrack?.id;

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
  useEffect(() => {
    if (id) {
      addTrack(id);
    }
  }, [id]);

  const addTrack = (idTrack: string) => {
    console.log("idTrack...", idTrack);
    GetPodCastSuggest(idTrack).then((res) => {
      if (!res.isError) {
        // console.log("res...", res.data);
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];

          const track1 = {
            url: element.attach_files[0].media_url,
            title: element.title,
            artist: element.user_id.display_name,
            artwork: element.post_avatar.media_url,
            id: element._id,
          };
          addTrackIfNotDuplicate(track1);
        }
      }
    });
  };
  async function addTrackIfNotDuplicate(newTrack) {
    // Lấy hàng đợi hiện tại
    const queue = await TrackPlayer.getQueue();
    console.log("queue...", queue);
    // Kiểm tra xem track mới có trùng ID với bất kỳ track nào trong hàng đợi không
    const isDuplicate = queue.some((track) => track.id === newTrack.id);

    // Nếu không trùng, thêm track vào hàng đợi
    if (!isDuplicate) {
      await TrackPlayer.add(newTrack);
      console.log(`Track ${newTrack.id} đã được thêm vào hàng đợi.`);
    } else {
      console.log(`Track ${newTrack.id} đã tồn tại trong hàng đợi.`);
    }
  }

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
      artwork:
        "https://files.exam24h.com/upload/2024/04/10_1712715670272/6615f765d29bd7cb5f9c5911-1712715670272-thumbnail-IMG_2559.JPG",
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
