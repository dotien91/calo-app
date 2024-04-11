import { StoreSlice } from "@zustand";
import { Track } from "react-native-track-player";

interface TrackAudio extends Track {
  position?: number;
}

export interface AudioSlice {
  listAudioHistory: TrackAudio[];
  addAudio: (track: TrackAudio) => void;
  updateAudio: (track: TrackAudio) => void;
}

const createAudioSlice: StoreSlice<AudioSlice> = (set, get) => ({
  listAudioHistory: [],
  addAudio: (track: TrackAudio) => {
    const { listAudioHistory } = get();
    const data = listAudioHistory.filter(
      (_item: TrackAudio) => _item?.url == track?.url,
    );
    console.log("track...", track);
    if (data.length > 0) {
      console.log("đã trùng");
      set({ listAudioHistory: listAudioHistory });
    } else {
      set({ listAudioHistory: [...listAudioHistory, track] });
    }
  },
  updateAudio: (track: TrackAudio) => {
    const { listAudioHistory } = get();
    const position = track.position || 0;
    const index = listAudioHistory.findIndex(
      (_item: TrackAudio) => _item?.url == track?.url,
    );
    if (index >= 0) {
      listAudioHistory[index] = {
        ...listAudioHistory[index],
        position: position,
        duration: track.duration,
      };
      return {
        listAudioHistory: listAudioHistory,
      };
    } else {
      console.log("Không có data....", track, "...", listAudioHistory);
      return {
        listAudioHistory: listAudioHistory,
      };
    }
  },
});
export default createAudioSlice;
