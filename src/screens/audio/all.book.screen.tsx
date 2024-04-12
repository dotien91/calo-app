import React from "react";
import { FlatList, SafeAreaView } from "react-native";

import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import { IAudioItem } from "models/audio.modal";
import AudioItemList from "./components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { useRoute } from "@react-navigation/native";

const AllBookScreen = () => {
  const userData = useStore((state) => state.userData);
  const route = useRoute();
  const id = route.params?.id || "";

  const { listData, isLoading } = useListData<IAudioItem>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      podcast_category: id,
    },
    GetPodCastList,
  );

  const data = React.useMemo(() => {
    return listData.slice(0, 15);
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
      <Header text={translations.audio.allAudio} />
      {!isLoading && data.length == 0 && renderEmptyCourseOfMe()}
      {isLoading && data.length == 0 && renderLoading()}
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
      />
    </SafeAreaView>
  );
};

export default AllBookScreen;
