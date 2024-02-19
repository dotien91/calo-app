import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, View } from "react-native";
import useDeepCompareEffect from "use-deep-compare-effect";

import { palette } from "@theme/themes";
import lodash from "lodash";
import LoadingList from "@shared-components/loading.list.component";
// onEndReach: (info?: { distanceFromEnd: number }) => void;
// refreshControl: () => JSX.Element;
// renderFooterComponent: () => JSX.Element;
interface TypedUseListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  refreshing: boolean;
  isFirstLoading: boolean;
  isLoading: boolean;
  setListData: (newListData: T[]) => void;
  _requestData: () => void;
  totalCount: number;
}

interface TypedRequestParams {
  limit: string;
  search?: string;
  page?: number;
  user_id?: string;
}

interface TypedStateListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  totalCount: number;
  isLoading: boolean;
  noData: boolean;
}

export function useListData<T>(
  params: TypedRequestParams,
  requestData: (params: TypedRequestParams) => Promise<T[]>,
  initData: T[] = [],
): TypedUseListData<T> {
  const [stateListData, setStateListData] = useState<TypedStateListData<T>>({
    listData: initData,
    nextPage: 1,
    isLastPage: false,
    totalCount: 0,
    isLoading: true,
    noData: false,
  });

  const [isLoadMore, setIsLoadmore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);

  useDeepCompareEffect(() => {
    _requestData(false);
  }, [params]);

  const _requestData = (showRefreshing: boolean | true) => {
    isFetching.current = true;
    if (stateListData.nextPage > 1 && showRefreshing) setRefreshing(true);
    // setIsLoading(true);
    requestData({ page: "1", ...params }).then((res: any) => {
      // console.log("resssssss", res);
      const newData = res.data;
      // setIsLoading(false);
      if (!res.isError && lodash.isArray(newData)) {
        isFetching.current = false;

        let isLastPage = false;
        let nextPage = 1;
        if (newData.length < params.limit) {
          isLastPage = true;
        } else {
          nextPage = 2;
        }
        setRefreshing(false);
        setStateListData((oldState) => ({
          ...oldState,
          isLastPage,
          nextPage,
          listData: newData,
          totalCount: res?.headers?.["x-total-count"] || 0,
          isLoading: false,
          noData: !newData.length,
        }));
      } else {
        setStateListData((oldState) => ({
          ...oldState,
          isLoading: false,
          noData: true,
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

  const refreshControl = () => (
    <RefreshControl
      onRefresh={_requestData}
      refreshing={refreshing}
      tintColor={palette.grey2}
      colors={[palette.grey2]}
    />
  );

  const renderFooterComponent = () => {
    if (!isLoadMore) return <View />;
    return <LoadingList numberItem={1} />;
  };

  return {
    listData: stateListData.listData,
    nextPage: stateListData.nextPage,
    isLastPage: stateListData.isLastPage,
    totalCount: stateListData.totalCount,
    noData: stateListData.noData,
    onEndReach,
    refreshControl,
    _requestData,
    renderFooterComponent,
    setListData,
    refreshing,
    isLoading: stateListData.isLoading,
    isFirstLoading: false,
  };
}
