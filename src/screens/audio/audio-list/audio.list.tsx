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
import { _getJson } from "@services/local-storage";

const AudioList = () => {
  const userData = useStore((state) => state.userData);

  const {
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
    const isWatched = _getJson(`Audio${item._id}`);
    console.log(isWatched, item._id);
    if (item?.is_join) {
      return null;
    } else {
      return (
        <AudioItemList
          listData={listData}
          isSliderItem
          data={item}
          key={index}
          isWatched={isWatched}
        />
      );
    }
  };

  const onSeeAll = () => {
    NavigationService.navigate(SCREENS.ALL_AUDIO_BOOk);
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };
  return (
    <View style={styles.container}>
      <AudioCategoryTitle
        hideViewAll={false}
        onPress={onSeeAll}
        title={translations.audio.allAudio}
      />
      {listData.length == 0 && isLoading ? (
        renderLoading()
      ) : (
        <FlatList
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
        />
      )}
    </View>
  );
};

export default AudioList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
