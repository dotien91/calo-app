import React, { useEffect } from "react";
import { FlatList, SafeAreaView } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import { TypeTrackLocal } from "models/audio.modal";
import AudioItemList from "./components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";

const RecommendBookScreen = () => {
  const userData = useStore((state) => state.userData);
  const setListAudio = useStore((state) => state.setListAudio);

  const { listData, isLoading } = useListData<TypeTrackLocal>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
    },
    GetPodCastList,
  );

  useEffect(() => {
    setListAudio(listData);
  }, [listData]);

  const renderItem = ({ item, index }) => {
    if (item?.is_join) {
      return null;
    } else {
      return <AudioItemList isSliderItem data={item} key={index} />;
    }
  };

  const renderEmptyCourseOfMe = () => {
    if (isLoading)
      return <EmptyResultView title={translations.audio.emptyAudio} />;
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.recommendBook} />
      {!isLoading && listData.length == 0 && renderEmptyCourseOfMe()}
      {isLoading && listData.length == 0 && renderLoading()}
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        // ListEmptyComponent={renderEmptyCourseOfMe()}
      />
    </SafeAreaView>
  );
};

export default RecommendBookScreen;
