import { useState, useEffect } from "react";
import useStore from "@services/zustand/store";
import { showErrorModal } from "@helpers/SuperModalHelper";
import {
  createLiveStream,
  getLiveStreamDetail,
} from "@services/api/livestreamApi";
import { ILiveData } from "@services/models/streamModel";

// const fakeData = {
//   _id: "6597cebd91125b0304b80819",
//   user_id: {
//     _id: "65825dcdfb422e86a200e7fb",
//     user_login: "anyenthuy_gmail.com",
//     user_avatar:
//       "https://api.edu-like.exam24h.com/api/animals/anteater_lg.png?color=40c9ff,e81cff",
//     user_avatar_thumbnail:
//       "https://api.edu-like.exam24h.com/api/animals/anteater_lg.png?color=40c9ff,e81cff",
//     display_name: "Tony Vu",
//     user_role: "user",
//     user_status: 1,
//     last_active: "2023-12-20T03:21:49.992Z",
//     official_status: false,
//   },
//   language: "en",
//   avatar: null,
//   media_id: null,
//   title: "Xin chào",
//   caption: "",
//   cookies: "",
//   ref_id: null,
//   product_id: null,
//   country: "",
//   like_number: 0,
//   view_number: 0,
//   comment_number: 0,
//   livestream_status: "wait",
//   ready_status: "",
//   input_type: "",
//   livestream_source: "",
//   whip_data: "",
//   whep_data: "",
//   cloudflare_stream_id: "",
//   music_id: [],
//   hashtag_id: [],
//   react_value: {
//     haha_value: 0,
//     like_value: 0,
//     love_value: 0,
//     care_value: 0,
//     wow_value: 0,
//     sad_value: 0,
//     angry_value: 0,
//     _id: "6597cebd91125b0304b8081a",
//   },
//   livestream_data: {
//     rtmp_url: "rtmps://broadcast.ieltshunter.io:1935/live",
//     m3u8_url: "https://live.ieltshunter.io/hls/K5AkOYa8kGbG583joByO.m3u8",
//     ingest_endpoint: "",
//     stream_key: "K5AkOYa8kGbG583joByO",
//     _id: "6597cebd91125b0304b8081d",
//   },
//   history_media: [],
//   createdAt: "2024-01-05T09:41:17.233Z",
//   updatedAt: "2024-01-05T09:41:17.283Z",
//   __v: 0,
// };

export const useLiveStream = ({
  isPublisher,
  liveStreamId,
}: {
  isPublisher: boolean;
  liveStreamId?: string;
}) => {
  const [liveData, setLiveData] = useState<ILiveData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const setViewNumber = useStore((state) => state.setViewNumber);

  const _createLiveStream = (title: string) => {
    setLoading(true);
    createLiveStream(title).then((res) => {
      setLoading(false);
      console.log("resssss create live", res);
      if (!res.isError && res.data._id) {
        setLiveData(res.data);
      } else {
        showErrorModal(res);
      }
    });
  };

  const _getLiveStreamDetail = () => {
    setLoading(true);
    getLiveStreamDetail(liveStreamId).then((res) => {
      setLoading(false);
      if (!res.isError && res.data?._id) {
        setLiveData(res.data);
        setViewNumber(res.data?.view_number || 0);
      } else {
        showErrorModal(res);
      }
    });
  };

  useEffect(() => {
    if (!!isPublisher || !liveStreamId) return;
    _getLiveStreamDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStreamId]);

  return { _createLiveStream, loading, liveData };
};
