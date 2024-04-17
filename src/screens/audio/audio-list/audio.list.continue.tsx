import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import useStore from "@services/zustand/store";
import { translations } from "@localization";
import AudioItem from "../components/audio.item";
import AudioCategoryTitle from "../audio-book/audio.category.title";

const AudioListContinue = () => {
  const listAudioHistory = useStore((state) => state.listAudioHistory);

  const renderItem = ({ item, index }) => {
    return <AudioItem isSliderItem data={item} key={index} />;
  };

  if (listAudioHistory.length == 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AudioCategoryTitle
        hideViewAll={false}
        title={translations.audio.continueListen}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listAudioHistory}
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
  );
};

export default AudioListContinue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
