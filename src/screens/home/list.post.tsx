/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import ItemPost from "./components/post-item/post.item";
import { getListLiveStream } from "@services/api/stream.api";
import StreamItem from "./components/post-item/stream.item";

import eventEmitter from "@services/event-emitter";
import { getListPost } from "@services/api/post";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { useUserHook } from "@helpers/hooks/useUserHook";
import EmptyResultView from "@shared-components/empty.data.component";
import { TypedPost } from "shared/models";
import LoadingList from "@shared-components/loading.list.component";
interface ListPostProps {
  isFollowingPost: boolean;
  id?: string;
}

const ListPost = ({ isFollowingPost, id }: ListPostProps) => {
  const listRef = useRef(null);

  const theme = useTheme();
  const { colors } = theme;

  const userData = useStore((state) => state.userData);
  const [listDataStream, setListDataStream] = useState([]);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();

  const renderItem = ({ item }: any) => {
    if (item?.livestream_status)
      return <StreamItem key={item._id} data={item} />;
    return <ItemPost key={item._id} data={item} isProfile={id?.length > 0} />;
  };

  const _getListLiveStream = () => {
    getListLiveStream().then((res) => {
      if (!res.isError) {
        const listDataStream = res.data.filter(
          (item) => item?.livestream_status == "live",
        );
        setListDataStream(listDataStream.reverse());
      }
    });
  };

  useEffect(() => {
    if (isFollowingPost) return;
    _getListLiveStream();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const paramsRequest = {
    limit: 10,
    auth_id: userData?._id || "",
    is_following_list: isFollowingPost + "",
  };
  if (id) {
    paramsRequest.user_id = id;
  }

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
    refreshing,
  } = useListData<TypedPost>(paramsRequest, getListPost);

  useEffect(() => {
    const typeEmit = isFollowingPost
      ? "reload_following_post"
      : "reload_list_post";
    eventEmitter.on(typeEmit, onRefresh);
    return () => {
      eventEmitter.off(typeEmit, onRefresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    _getListLiveStream();
    // resetListLike();
  }, [refreshing]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = () => {
    _getListLiveStream();
    _requestData();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  if (!isLoggedIn() && isFollowingPost) {
    return (
      <View style={{ ...CommonStyle.flex1, ...CommonStyle.center }}>
        {renderViewRequestLogin()}
      </View>
    );
  }

  if (isLoading) {
    return <LoadingList numberItem={7} />;
  }

  const renderEmpty = () => {
    return (
      <View
        style={{
          ...CommonStyle.center,
          ...CommonStyle.flex1,
          backgroundColor: colors.background,
          paddingVertical: 40,
          minHeight: 500,
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

  const getListData = () => {
    if (id) return listData;
    return listDataStream.concat(listData);
  };

  return (
    <View
      style={{
        ...CommonStyle.flex1,
        backgroundColor: colors.background,
      }}
    >
      <FlatList
        ref={listRef}
        data={getListData()}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
        ListEmptyComponent={renderEmpty()}
      />
    </View>
  );
};

export default ListPost;
