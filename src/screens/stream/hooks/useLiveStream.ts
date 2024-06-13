import { useState, useEffect, useMemo, useRef } from "react";
import useStore from "@services/zustand/store";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import {
  createLiveStream,
  getLiveStreamDetail,
  requestGoLive,
} from "@services/api/stream.api";
import { ILiveData } from "models/stream.model";

export const useLiveStream = ({
  isPublisher,
  liveStreamId,
  group_id,
  go_live_id,
}: {
  isPublisher: boolean;
  liveStreamId?: string;
  group_id?: string;
  go_live_id?: string;
}) => {
  const [liveData, setLiveData] = useState<ILiveData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const setViewNumber = useStore((state) => state.setViewNumber);
  const setEmojiNumber = useStore((state) => state.setEmojiNumber);
  const setShoppingProduct = useStore((state) => state.setShoppingProduct);
  const setUserLive = useStore((state) => state.setUserLive);
  const tmpCheckScheduleStream = useRef("");

  useEffect(() => {
    return () => {
      if (tmpCheckScheduleStream.current)
        clearInterval(tmpCheckScheduleStream.current);
    };
  }, []);

  useEffect(() => {
    if (go_live_id) {
      showLoading();
      setLoading(true);
      requestGoLive({
        livestream_id: go_live_id,
      }).then((res) => {
        console.log("ressss", res);
        setLoading(false);
        if (res.isError) {
          showToast({
            type: "error",
            message: res?.message,
          });
        } else {
          getLiveStreamDetail(go_live_id).then((res) => {
            closeSuperModal();
            setLoading(false);
            console.log("livedata detail", res.data);
            if (!res.isError && res.data?._id) {
              setLiveData(res.data);
              setUserLive(res.data.user_id);
              setEmojiNumber(res.data?.like_number || 0);
              setViewNumber(res.data?.view_number || 0);
              setShoppingProduct(res.data?.product_id);
            }
          });
        }
      });
    }
  }, [go_live_id]);

  const _createLiveStream = (data: { title: string; cover_url: string }) => {
    setLoading(true);
    createLiveStream({ ...data, group_id }).then((res) => {
      setLoading(false);

      if (!res.isError && res.data._id) {
        setLiveData(res.data);
        setUserLive(res.data.user_id);
        setEmojiNumber(res.data?.like_number || 0);
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const checkScheduleStream = (data) => {
    if (!data?.livestream_data?.m3u8_url && data?.is_join) {
      tmpCheckScheduleStream.current = setInterval(() => {
        _getLiveStreamDetail(true);
      }, 3000);
    }
  };

  const _getLiveStreamDetail = (fromInterval = false) => {
    setLoading(true);
    getLiveStreamDetail(liveStreamId).then((res) => {
      setLoading(false);
      console.log("livedata detail", res.data);
      if (!res.isError && res.data?._id) {
        setLiveData(res.data);
        setUserLive(res.data.user_id);
        setEmojiNumber(res.data?.like_number || 0);
        setViewNumber(res.data?.view_number || 0);
        setShoppingProduct(res.data?.product_id);
        !fromInterval && checkScheduleStream(res.data);
      } else {
        !fromInterval &&
          showToast({
            type: "error",
            ...res,
          });
      }
    });
  };

  const endLiveStream = () => {
    setLiveData(null);
    setViewNumber(0);
  };

  const isCommingSoon = useMemo(() => {
    return (
      !liveData?.livestream_data?.m3u8_url &&
      liveData?.livestream_status == "schedule"
    );
  }, [liveData]);

  useEffect(() => {
    if (!!isPublisher || !liveStreamId) return;
    _getLiveStreamDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStreamId]);

  return { _createLiveStream, loading, liveData, endLiveStream, isCommingSoon };
};
