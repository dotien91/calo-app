import React from "react";
import { FlatList, SafeAreaView, View } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { GetPodCastList } from "@services/api/podcast.api";
import { TypeTrackLocal } from "models/audio.modal";
import AudioItemList from "./components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "./hook/useLastActiveTrack";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { palette } from "@theme/themes";

const RecommendBookScreen = () => {
  const userData = useStore((state) => state.userData);
  // const setListAudio = useStore((state) => state.setListAudio);

  const params = {
    auth_id: userData?._id,
    // order_by: "DESC",
    sort_by: "createdAt",
  };
  if (userData?._id) {
    params.type = "suggestion";
  }
  const { listData, isLoading } = useListData<TypeTrackLocal>(
    params,
    GetPodCastList,
  );

  // useEffect(() => {
  //   setListAudio(listData);
  // }, [listData]);
  const renderItem = ({ item, index }) => {
    if (item?.is_join) {
      return null;
    } else {
      return (
        <AudioItemList
          listData={listData}
          isSliderItem
          data={item}
          key={index}
        />
      );
    }
  };

  const renderEmptyCourseOfMe = () => {
    if (isLoading)
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
      "https://files.exam24h.com/upload/2024/05/10_1715327584971/661768ce52c681916687c57c/sound.m4a";
  console.log(hide);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.recommendBook} />
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
        // ListEmptyComponent={renderEmptyCourseOfMe()}
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

export default RecommendBookScreen;
