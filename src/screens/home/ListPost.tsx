/* eslint-disable camelcase */
/*eslint no-unsafe-optional-chaining: "error"*/

import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import ItemPost from "./components/ItemPost/ItemPost";
import { getListPost } from "@services/api/post";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { useListData } from "utils/helpers/useListData";
import LottieView from "lottie-react-native";
import EmptyResultView from "@helpers/EmptyResultView";
import eventEmitter from "@services/event-emitter";
import { useTheme } from "@react-navigation/native";

const ListPost = () => {
  const userData = useStore((state) => state.userData);
  const listPostDelete = useStore((state) => state.listPostDelete);
  const resetListLike = useStore((state) => state.resetListLike);
  const theme = useTheme();
  const { colors } = theme;

  useEffect(() => {
    resetListLike();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderItem = ({ item }: any) => {
    return <ItemPost key={item._id} data={item} refreshing={refreshing} />;
  };

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    refreshListPage,
    refreshing,
  } = useListData<any>(
    { limit: 10, auth_id: userData?._id || "" },
    getListPost,
  );

  useEffect(() => {
    resetListLike();
  }, [refreshing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    eventEmitter.on("reload_list_post", refreshListPage);
    return () => {
      eventEmitter.off("reload_list_post", () => refreshListPage);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <View
      style={{
        ...CommonStyle.flex1,
        backgroundColor: colors.background,
      }}
    >
      <FlatList
        data={listData.filter((item) => listPostDelete.indexOf(item._id) < 0)}
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
