import React, { useState } from "react";
import { showToast } from "@helpers/super.modal.helper";
import { Nullable } from "models";

interface TypedUseApi<T> {
  data: Nullable<T>;
  _requestData: (params: any) => void;
  noData: boolean;
  isLoading: boolean;
}

interface IParams {
  params: any;
  requestData: (params: any) => Promise<any>;
  showError?: boolean;
}

interface TypedStateListData<T> {
  data: Nullable<T>;
  isLoading: boolean;
  noData: boolean;
}

export function useApi<T>({
  params,
  requestData,
  showError
}: IParams): TypedUseApi<T> {
  const [stateListData, setStateListData] = useState<TypedStateListData<T>>({
    data: null,
    isLoading: true,
    noData: false,
  });

  React.useEffect(() => {
    _requestData();
  }, []);

  const _requestData = () => {
    requestData(params).then((res: any) => {
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
