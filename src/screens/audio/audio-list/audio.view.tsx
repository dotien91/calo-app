import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import { IAudioItem } from "models/audio.modal";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import AudioItem from "../components/audio.item";
import AudioCategoryTitle from "../audio-book/audio.category.title";
import { SCREENS } from "constants";
import LoadingItem from "@shared-components/loading.item";
import SubscriptionBtn from "@screens/home/components/subscription-btn/SubscriptionBtn";

interface AudioViewProps {
  onPress?: () => void;
  fromTeacherScreen?: boolean;
  extraParams?: object;
}
const AudioView = ({
  onPress,
  extraParams,
  fromTeacherScreen,
}: AudioViewProps) => {
  const userData = useStore((state) => state.userData);

  const { listData, isLoading, noData } = useListData<IAudioItem>(
    {
      ...extraParams,
      limit: "6",
      auth_id: userData?._id,
      // type: "suggestion",
    },
    GetPodCastList,
  );

  const onSeeAll = () => {
    if (onPress) {
      onPress();
    } else {
      NavigationService.navigate(SCREENS.RECOMMEND_AUDIO_BOOK);
    }
  };

  const renderItem = (item: IAudioItem, index: number) => {
    return (
      <AudioItem
        isSliderItem
        data={item.item}
        key={index}
        listData={listData}
      />
    );
  };

  if (noData) return null;

  const renderLoading = () => {
    return <LoadingItem />;
  };

  return (
    <View style={styles.container}>
      {fromTeacherScreen && (
        <View style={{ padding: 16 }}>
          <SubscriptionBtn />
        </View>
      )}
      <AudioCategoryTitle
        hideViewAll={false}
        onPress={onSeeAll}
        title={
          fromTeacherScreen
            ? translations.audio.teacherPodcast
            : translations.audio.recommendBook
        }
      />
      {listData.length == 0 && isLoading ? (
        renderLoading()
      ) : (
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
      )}
    </View>
  );
};

export default AudioView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
