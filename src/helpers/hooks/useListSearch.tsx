import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import lodash from "lodash";
import useDeepCompareEffect from "use-deep-compare-effect";
import LoadingList from "@shared-components/loading.list.component";

interface TypedUseListSearch<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  refreshing: boolean;
  isLoading: boolean;
  onEndReach: (info?: { distanceFromEnd: number }) => void;
  refreshControl: () => JSX.Element;
  renderFooterComponent: () => JSX.Element;
  setListData: (newListData: T[]) => void;
  _requestData: (v: boolean) => void;
  totalCount: number;
}

interface TypedRequestParams {
  limit?: string;
  search?: string;
  page?: string;
}

interface TypedStateListSearch<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  totalCount: number;
  noData: boolean;
}

export function useListSearch<T>(
  params: TypedRequestParams,
  requestData: (params: TypedRequestParams) => Promise<T[]>,
  initData: T[] = [],
): TypedUseListSearch<T> {
  const [stateListData, setStateListData] = useState<TypedStateListSearch<T>>({
    listData: initData,
    nextPage: 1,
    isLastPage: false,
    totalCount: 0,
    noData: false,
  });

  const [isLoadMore, setIsLoadmore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFetching = useRef(false);

  useDeepCompareEffect(() => {
    setStateListData((oldState) => ({
      ...oldState,
      listData: [],
      totalCount: 0,
    }));
    _requestData();
  }, [params]);

  const _requestData = () => {
    isFetching.current = true;
    setIsLoading(true);
    requestData({ page: "1", ...params }).then((res: any) => {
      const newData = res.data;
      setIsLoading(false);
      if (!res.isError && lodash.isArray(newData)) {
        isFetching.current = false;

        let isLastPage = false;
        let nextPage = 1;
        if (newData.length < params.limit) {
          isLastPage = true;
        } else {
          nextPage = 2;
        }
        setStateListData((oldState) => ({
          ...oldState,
          isLastPage,
          nextPage,
          listData: newData,
          totalCount: res?.headers?.["x-total-count"] || 0,
        }));
      }
    });
  };

  async function onEndReach() {
    if (!stateListData.isLastPage && !isFetching.current) {
      isFetching.current = true;
      setIsLoadmore(true);
      await requestData({ page: stateListData.nextPage + "", ...params }).then(
        (res: any) => {
          setIsLoadmore(false);
          const newData = res.data;
          isFetching.current = false;

          if (!res.isError && lodash.isArray(newData)) {
            let isLastPage = false;
            let { nextPage } = stateListData;

            if (newData.length < params.limit) {
              isLastPage = true;
            } else {
              nextPage = stateListData.nextPage + 1;
            }

            setStateListData((oldState) => ({
              ...oldState,
              isLastPage,
              nextPage,
              listData: [...stateListData.listData, ...newData],
              totalCount: res?.headers?.["x-total-count"] || 0,
            }));
          } else {
            setStateListData((oldState) => ({
              ...oldState,
            }));
          }
        },
      );
    }
  }

  const setListData = useCallback((newListData: T[]) => {
    setStateListData((oldState) => ({
      ...oldState,
      listData: newListData,
    }));
  }, []);

  const renderFooterComponent = () => {
    if (!isLoadMore) return <View />;
    return <LoadingList />;
  };

  const a = 1;

  return {
    listData: stateListData.listData,
    nextPage: stateListData.nextPage,
    isLastPage: stateListData.isLastPage,
    totalCount: stateListData.totalCount,
    onEndReach,
    _requestData,
    renderFooterComponent,
    setListData,
    isLoading,
    a,
  };
}
