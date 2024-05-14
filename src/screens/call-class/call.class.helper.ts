import { isAndroid } from "@helpers/device.info.helper";
import TrackPlayer from "react-native-track-player";

export const _isTeacher = (name: string) => {
  console.log("_isTeacher param", name);
  return name.includes("tutor");
};

export const setSpeakerByTrick = async () => {
  if (isAndroid()) return
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
  setTimeout(() => {
    TrackPlayer.stop();
  }, 2000);
};
