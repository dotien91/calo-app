import React, { memo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import { IAudioItem } from "models/audio.modal";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import {
  GetPodCastList,
  // requestCreatorPodcast,
} from "@services/api/podcast.api";
import AudioItem from "../components/audio.item";
import AudioCategoryTitle from "../audio-book/audio.category.title";
import { SCREENS } from "constants";
import LoadingItem from "@shared-components/loading.item";
// import SubscriptionBtn from "@screens/home/components/subscription-btn/SubscriptionBtn";
import { getListUser } from "@services/api/user.api";
// import UserItem from "@screens/course-tab/components/user.item";
import { navigate } from "@helpers/navigation.helper";
import TutorItem from "@screens/course-tab/components/tutor.item";

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
  const [listCreator, setListCreator] = React.useState([]);
  const { listData, isLoading, noData } = useListData<IAudioItem>(
    {
      ...extraParams,
      limit: "10",
      auth_id: userData?._id,
      // type: "suggestion",
    },
    GetPodCastList,
  );
  const { listData: listData2, noData: noData2 } = useListData<IAudioItem>(
    {
      limit: "10",
      auth_id: userData?._id,
      sort_by: "createdAt",
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

  React.useEffect(() => {
    getListUser({
      is_creator: true,
      limit: 6,
    }).then((res) => {
      if (!res.isError) {
        setListCreator(res.data);
      }
    });
  }, []);

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

  const renderItemCreator = (item) => {
    return <TutorItem isSliderItem {...item.item} />;
  };

  const seeAllCreator = () => {
    navigate(SCREENS.LIST_CREATORS);
  };

  const renderCreatorView = () => {
    if (fromTeacherScreen) return null;

    return (
      <>
        <AudioCategoryTitle
          hideViewAll={false}
          onPress={seeAllCreator}
          title={translations.creator}
        />
        {listData.length == 0 && isLoading ? (
          renderLoading()
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={listCreator}
            renderItem={renderItemCreator}
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
      </>
    );
  };

  if (noData && noData2) return null;
  if (noData && fromTeacherScreen) return null;

  const renderLoading = () => {
    return <LoadingItem />;
  };

  return (
    <View style={styles.container}>
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
          data={
            fromTeacherScreen
              ? [...listData]
              : [...listData, ...listData2].slice(0, 10)
          }
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
      {renderCreatorView()}
    </View>
  );
};

export default memo(AudioView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
