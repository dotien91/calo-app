import { useListData } from "@helpers/hooks/useListData";
import { GetPodCastList } from "@services/api/podcast.api";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import AudioItemList from "../components/audio.item.list";
import { translations } from "@localization";
import EmptyResultView from "@shared-components/empty.data.component";

const MyAudioScreen = () => {
  const userData = useStore((store) => store.userData);

  const { listData, isLoading } = useListData<any>(
    {
      // auth_id: userData?._id,
      user_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      limit: "10",
    },
    GetPodCastList,
  );

  const renderItem = ({ item, index }) => {
    return <AudioItemList isSliderItem data={item} key={index} />;
  };
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.podcast.myPodcast} />
      {!isLoading && listData.length == 0 && <EmptyResultView />}
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

export default MyAudioScreen;
