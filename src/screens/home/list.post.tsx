/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import ItemPost from "./components/post-item/post.item";

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
import { HFlatList } from "react-native-head-tab-view";

interface ListPostProps {
  isFollowingPost: boolean;
  id?: string;
  isProfile?: boolean;
}

const ListPost = ({ isFollowingPost, id, isProfile }: ListPostProps) => {
  const listRef = useRef(null);

  const theme = useTheme();
  const { colors } = theme;

  const userData = useStore((state) => state.userData);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} isProfile={id?.length > 0} />;
  };

  useEffect(() => {
    if (isFollowingPost) return;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const paramsRequest = {
    limit: 5,
    auth_id: userData?._id || "",
    is_following_list: isFollowingPost + "",
  };
  if (id) {
    paramsRequest.user_id = id;
    paramsRequest.order_by = "DESC";
  }

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypedPost>(paramsRequest, getListPost, []);

  useEffect(() => {
    const typeEmit = isFollowingPost
      ? "reload_following_post"
      : "reload_list_post";
    eventEmitter.on(typeEmit, onRefresh);
    return () => {
      eventEmitter.off(typeEmit, onRefresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = () => {
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

  const renderHeader = () => {
    if (!isLoading) return null;
    return <LoadingList numberItem={3} />;
  };
  if (isProfile) {
    return (
      <View
        style={{
          ...CommonStyle.flex1,
          backgroundColor: colors.background,
        }}
      >
        <FlatList
          ref={listRef}
          data={listData}
          renderItem={renderItem}
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
  }
  return (
    <View
      style={{
        ...CommonStyle.flex1,
        backgroundColor: colors.background,
      }}
    >
      <HFlatList
        ListHeaderComponent={renderHeader}
        index={isFollowingPost ? 1 : 0}
        ref={listRef}
        data={listData}
        renderItem={renderItem}
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
