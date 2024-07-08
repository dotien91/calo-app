import React, { useEffect } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

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
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { palette } from "@theme/themes";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "./hook/useLastActiveTrack";

const AllBookScreen = () => {
  const userData = useStore((state) => state.userData);
  const setListAudio = useStore((state) => state.setListAudio);

  const route = useRoute();
  const id = route.params?.id || "";
  const name = route.params?.name;
  const fromPodcastWatched = route.params?.fromPodcastWatched || false;
  const listAudioWatched = useStore((state) => state.listAudioWatched);

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

  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  const hide =
    !displayedTrack ||
    displayedTrack.url ===
      "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3";

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name || translations.audio.allAudio} />
      {!isLoading &&
        listData.length == 0 &&
        !fromPodcastWatched &&
        renderEmptyCourseOfMe()}
      {isLoading &&
        listData.length == 0 &&
        !fromPodcastWatched &&
        renderLoading()}
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={fromPodcastWatched ? listAudioWatched : listData}
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
      {!hide && (
        <View
          style={{
            height: getBottomSpace() + 60,
            width: SCREEN_WIDTH,
            position: "absolute",
            zIndex: 1,
            backgroundColor: palette.background,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllBookScreen;
