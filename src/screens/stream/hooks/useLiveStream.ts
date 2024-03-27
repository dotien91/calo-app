import { useState, useEffect } from "react";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import {
  createLiveStream,
  getLiveStreamDetail,
} from "@services/api/stream.api";
import { ILiveData } from "models/stream.model";

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
  const setShoppingProduct = useStore((state) => state.setShoppingProduct);

  const _createLiveStream = (title: string, avatar: string) => {
    setLoading(true);
    createLiveStream(title, avatar).then((res) => {
      console.log("createLiveStream", res);
      setLoading(false);

      if (!res.isError && res.data._id) {
        setLiveData(res.data);
      } else {
        showToast({
          type: "error",
          ...res,
        });
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
        setShoppingProduct(res.data?.product_id);
      } else {
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

  useEffect(() => {
    if (!!isPublisher || !liveStreamId) return;
    _getLiveStreamDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStreamId]);

  return { _createLiveStream, loading, liveData, endLiveStream };
};
