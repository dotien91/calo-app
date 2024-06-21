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
import UserItem from "@screens/course-tab/components/user.item";
import ListUser from "@shared-components/modal/modal-inner/ListUser";
import { getListUser } from "@services/api/user.api";
import { TypedUser } from "models";
import TutorItem from "@screens/course-tab/components/tutor.item";

const AllCreatorScreen = () => {
  const userData = useStore((state) => state.userData);

  const route = useRoute();
  const id = route.params?.id || "";

  const {    
     listData,
    isLoading,
    onEndReach,
    renderFooterComponent,
    refreshing, } = useListData<TypeTrackLocal>(
    {
      is_creator: true,
      limit: 6
    },
    getListUser,
  );


  const renderItem = ({ item }) => {
      return <TutorItem {...item} />
  };

  const renderEmptyCourseOfMe = () => {
    return <EmptyResultView />;
  };
  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };


  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.creator} />
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
        onEndReached={onEndReach}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

export default AllCreatorScreen;
