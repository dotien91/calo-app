/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import ItemPost from "@screens/home/components/post-item/post.item";

import eventEmitter from "@services/event-emitter";
import { getListPost } from "@services/api/post.api";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import EmptyResultView from "@shared-components/empty.data.component";
import { TypedPost } from "shared/models";
import LoadingList from "@shared-components/loading.list.component";
import ListLiveStream from "@screens/home/components/list-livestream/list.liveStream";

interface ListPostClubProps {
  id: string;
}

const ListPostClub = ({ id }: ListPostClubProps) => {
  const listRef = useRef(null);

  const theme = useTheme();
  const { colors } = theme;

  const userData = useStore((state) => state.userData);

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} />;
  };

  const paramsRequest = {
    limit: 5,
    auth_id: userData?._id || "",
    group_id: id,
    order_by: "DESC",
  };

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypedPost>(paramsRequest, getListPost, []);

  useEffect(() => {
    const typeEmit = "reload_list_post";
    eventEmitter.on(typeEmit, onRefresh);
    return () => {
      eventEmitter.off(typeEmit, onRefresh);
    };
  }, []);

  const onRefresh = () => {
    _requestData();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View
        style={{
          ...CommonStyle.center,
          backgroundColor: colors.background,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyPostTitle}
          desc={translations.post.emptyPostDes}
          icon="document-text-outline"
          showLottie={false}
        />
      </View>
    );
  };

  const _renderHeader = () => {
    return <ListLiveStream group_id={id} />;
  };

  const renderHeader = () => {
    return <LoadingList numberItem={3} />;
  };
  return (
    <View
      style={{
        backgroundColor: colors.background,
      }}
    >
      {listData.length == 0 && isLoading && renderHeader()}
      <FlatList
        ref={listRef}
        data={listData}
        ListHeaderComponent={_renderHeader}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        ListEmptyComponent={renderEmpty()}
        contentContainerStyle={{ paddingBottom: 160 }}
      />
    </View>
  );
};

export default ListPostClub;
