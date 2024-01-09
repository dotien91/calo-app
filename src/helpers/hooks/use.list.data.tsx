import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { palette } from "@theme/themes";
import lodash from "lodash";
import useDeepCompareEffect from "use-deep-compare-effect";

interface TypedUseListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
  refreshing: boolean;
  isFirstLoading: boolean;
  isLoading: boolean;
  onEndReach: (info?: { distanceFromEnd: number }) => void;
  refreshControl: () => JSX.Element;
  renderFooterComponent: () => JSX.Element;
  setListData: (newListData: T[]) => void;
  refreshListPage: () => void;
}

interface TypedRequestParams {
  limit: number;
  search?: string;
  page?: number;
}

interface TypedStateListData<T> {
  listData: T[];
  nextPage: number;
  isLastPage: boolean;
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
  });

  const [isLoadMore, setIsLoadmore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(!initData.length);
  const isFetching = useRef(false);

  useDeepCompareEffect(() => {
    refreshListPage();
  }, [params]);

  const refreshListPage = async () => {
    isFetching.current = true;
    if (stateListData.nextPage > 1) setRefreshing(true);
    setIsLoading(true);
    await requestData({ page: 1, ...params }).then((res: any) => {
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
        setRefreshing(false);
        setStateListData((oldState) => ({
          ...oldState,
          isLastPage,
          nextPage,
          listData: newData,
        }));
      }
      setIsFirstLoading(false);
    });
  };

  async function onEndReach() {
    if (!stateListData.isLastPage && !isFetching.current) {
      isFetching.current = true;
      setIsLoadmore(true);
      await requestData({ page: stateListData.nextPage, ...params }).then(
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
      onRefresh={refreshListPage}
      refreshing={refreshing}
      tintColor={palette.grey2}
      colors={[palette.grey2]}
    />
  );

  const renderFooterComponent = () => {
    if (!isLoadMore) return <View />;
    return (
      <View style={{ padding: 10, flex: 1, marginTop: 20 }}>
        <ActivityIndicator color={palette.grey2} />
      </View>
    );
  };

  return {
    listData: stateListData.listData,
    nextPage: stateListData.nextPage,
    isLastPage: stateListData.isLastPage,
    isFirstLoading,
    onEndReach,
    refreshControl,
    refreshListPage,
    renderFooterComponent,
    setListData,
    refreshing,
    isLoading,
  };
}
