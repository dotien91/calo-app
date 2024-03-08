import React, { useState } from "react";
import { showToast } from "@helpers/super.modal.helper";

interface TypedUseApi {
  params: any;
  showError: boolean;
  requestData: (params: any) => void;
}

interface TypedStateListData {
  data: any;
  isLoading: boolean;
  noData: boolean;
}

export function useApi({
  params,
  requestData,
  showError = false,
}: TypedUseApi) {
  const [stateListData, setStateListData] = useState<TypedStateListData>({
    data: null,
    isLoading: true,
    noData: false,
  });

  React.useEffect(() => {
    _requestData();
  }, []);

  const _requestData = () => {
    requestData({ page: "1", ...params }).then((res: any) => {
      // setIsLoading(false);
      if (!res.isError) {
        setStateListData((oldState) => ({
          ...oldState,
          data: res.data,
          isLoading: false,
        }));
      } else {
        if (showError) {
          showToast({
            type: "error",
          });
        }
        setStateListData((oldState) => ({
          ...oldState,
          isLoading: false,
          noData: true,
        }));
      }
    });
  };

  return {
    data: stateListData.data,
    noData: stateListData.noData,
    isLoading: stateListData.isLoading,
    _requestData,
  };
}
