import React, { useEffect } from "react";
import { FlatList, SafeAreaView } from "react-native";

import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import { TypeTrackLocal } from "models/audio.modal";
import AudioItemList from "./components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { useRoute } from "@react-navigation/native";

const AllBookScreen = () => {
  const userData = useStore((state) => state.userData);
  const setListAudio = useStore((state) => state.setListAudio);

  const route = useRoute();
  const id = route.params?.id || "";
  const name = route.params?.name;

  const { listData, isLoading } = useListData<TypeTrackLocal>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      podcast_category: id,
      limit: "10",
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
    return <EmptyResultView title={translations.audio.emptyAudio} />;
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name || translations.audio.allAudio} />
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
      />
    </SafeAreaView>
  );
};

export default AllBookScreen;
