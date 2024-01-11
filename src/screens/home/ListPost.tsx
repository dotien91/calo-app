/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import ItemPost from "./components/ItemPost/ItemPost";
import { getListPost } from "@services/api/post";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import LottieView from "lottie-react-native";
import EmptyResultView from "@shared-components/empty.data.component";
import eventEmitter from "@services/event-emitter";
import { useTheme } from "@react-navigation/native";

import { getListLiveStream } from "@services/api/livestreamApi";
import StreamItem from "./components/ItemPost/stream.item";

import { useUserHook } from "@helpers/hooks/useUserHook";

interface ListPostProps {
  isFollowingPost: boolean;
}

const ListPost = ({ isFollowingPost }: ListPostProps) => {
  const userData = useStore((state) => state.userData);
  const resetListLike = useStore((state) => state.resetListLike);

  const [listDataStream, setListDataStream] = useState([]);

  const { isLoggedIn, renderViewRequestLogin } = useUserHook();

  const listRef = useRef(null);

  const theme = useTheme();
  const { colors } = theme;

  const renderItem = ({ item }: any) => {
    if (item?.livestream_status)
      return <StreamItem key={item._id} data={item} />;
    return <ItemPost key={item._id} data={item} />;
  };

  useEffect(() => {
    if (isFollowingPost) return;
    getListLiveStream().then((res) => {
      if (!res.isError) {
        const listDataStream = res.data.filter(
          (item) => item?.livestream_status == "live",
        );
        console.log("listDataStreamlistDataStream", listDataStream);
        setListDataStream(listDataStream.reverse());
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    refreshListPage,
    refreshing,
  } = useListData<any>(
    {
      limit: 10,
      auth_id: userData?._id || "",
      is_following_list: isFollowingPost + "",
    },
    getListPost,
  );

  useEffect(() => {
    const typeEmit = isFollowingPost
      ? "reload_following_post"
      : "reload_list_post";
    eventEmitter.on(typeEmit, _refreshListPage);
    return () => {
      eventEmitter.off(typeEmit, _refreshListPage);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    resetListLike();
  }, [refreshing]); // eslint-disable-line react-hooks/exhaustive-deps

  const _refreshListPage = () => {
    refreshListPage();
    setTimeout(() => {
      console.log("listReflistRef", listRef);
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  const getListData = () => listDataStream.concat(listData);

  if (isFirstLoading) {
    return (
      <View
        style={{
          ...CommonStyle.safeAreaView,
          backgroundColor: colors.background2,
        }}
      >
        <LottieView
          style={CommonStyle.flex1}
          resizeMode="cover"
          source={require("./lottie/loading.json")}
          autoPlay
          loop
        />
      </View>
    );
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
        />
      </View>
    );
  };

  if (!isLoggedIn() && isFollowingPost) {
    return (
      <View style={{ ...CommonStyle.flex1, ...CommonStyle.center }}>
        {renderViewRequestLogin()}
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
