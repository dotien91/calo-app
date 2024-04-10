import React from "react";
import { FlatList, SafeAreaView } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import { IAudioItem } from "models/audio.modal";
import AudioItemList from "./components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";

const RecommendBookScreen = () => {
  const userData = useStore((state) => state.userData);

  const { listData, isLoading } = useListData<IAudioItem>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
    },
    GetPodCastList,
  );

  const data = React.useMemo(() => {
    return listData.slice(0, 15);
  }, [listData]);

  const renderItem = (item: IAudioItem, index: number) => {
    if (item.item?.is_join) {
      return null;
    } else {
      return (
        <>
          <AudioItemList isSliderItem data={item.item} key={index} />
        </>
      );
    }
  };

  const renderEmptyCourseOfMe = () => {
    if (isLoading)
      return <EmptyResultView title={translations.audio.emptyAudio} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.recommendBook} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
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
        ListEmptyComponent={renderEmptyCourseOfMe()}
      />
    </SafeAreaView>
  );
};

export default RecommendBookScreen;
