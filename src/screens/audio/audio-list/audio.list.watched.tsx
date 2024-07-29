import { View, FlatList, StyleSheet } from "react-native";
import React from "react";
import useStore from "@services/zustand/store";
// import LoadingItem from '@shared-components/loading.item';
import AudioCategoryTitle from "../audio-book/audio.category.title";
import { translations } from "@localization";
import AudioItem from "../components/audio.item";
import { TypeAudioWatched } from "@services/zustand/audio/AudioSlice";
import { navigate } from "react-navigation-helpers";
import { SCREENS } from "constants";

const AudioListWatched = () => {
  const listData = useStore((state) => state.listAudioWatched).slice(0, 10);
  // console.log("listDATA===========", listData)
  // const renderLoading = () => {
  //     return <LoadingItem />;
  //   };
  const renderItem = (item: TypeAudioWatched, index: number) => {
    return (
      <AudioItem
        isSliderItem
        data={item.item}
        key={index}
        // listData={listData}
      />
    );
  };
  const onSeeAll = () => {
    navigate(SCREENS.ALL_AUDIO_BOOk, {
      fromPodcastWatched: true,
      name: translations.audio.watched,
    });
  };
  return (
    <>
      {listData.length > 0 ? (
        <View style={styles.container}>
          <AudioCategoryTitle
            hideViewAll={false}
            onPress={onSeeAll}
            title={translations.audio.watched}
          />
          <FlatList
            horizontal
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
        </View>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 10,
  },
});
export default AudioListWatched;
