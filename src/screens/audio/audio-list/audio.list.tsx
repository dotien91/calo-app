import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import { TypeTrackLocal } from "models/audio.modal";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import AudioCategoryTitle from "../audio-book/audio.category.title";
import AudioItemList from "../components/audio.item.list";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import AudioQuickFilter from "../components/audio.quick.filter";
import AudioView from "./audio.view";
import EmptyResultView from "@shared-components/empty.data.component";

const AudioList = () => {
  const userData = useStore((state) => state.userData);

  const {
    noData,
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    renderFooterComponent,
  } = useListData<TypeTrackLocal>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      limit: "10",
      podcast_category: "",
    },
    GetPodCastList,
  );
  const renderItem = ({ item, index }) => {
    return (
      <AudioItemList
        listData={listData}
        isSliderItem
        data={item}
        key={index}
      />
    );
  };

  const onSeeAll = () => {
    NavigationService.navigate(SCREENS.ALL_AUDIO_BOOk);
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  function renderHeader() {
    return (
      <View style={{ marginHorizontal: -16 }}>
        <AudioQuickFilter />
        <AudioView />
        <AudioCategoryTitle
          hideViewAll={false}
          onPress={onSeeAll}
          title={translations.audio.allAudio}
        />
      </View>
    );
  }

  const renderEmptyComponent = () => {
    if (!noData) return null
    return <EmptyResultView />
  }


  return (
    <View style={styles.container}>

      {listData.length == 0 && isLoading ? (
        renderLoading()
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader()}
          showsHorizontalScrollIndicator={false}
          data={listData}
          renderItem={renderItem}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingLeft: 16,
            paddingBottom: 80,
          }}
          initialNumToRender={2}
          onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id + ""}
          onEndReached={onEndReach}
          removeClippedSubviews={true}
          refreshControl={refreshControl()}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={renderEmptyComponent()}
        />
      )}
    </View>
  );
};

export default AudioList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
