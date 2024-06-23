import React from "react";
import { FlatList, SafeAreaView } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import { TypeTrackLocal } from "models/audio.modal";
import EmptyResultView from "@shared-components/empty.data.component";
import LoadingList from "@shared-components/loading.list.component";
import { getListUser } from "@services/api/user.api";
import TutorItem from "@screens/course-tab/components/tutor.item";

const AllCreatorScreen = () => {
  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListData<TypeTrackLocal>(
      {
        is_creator: true,
        limit: 6,
      },
      getListUser,
    );

  const renderItem = ({ item }) => {
    return <TutorItem {...item} />;
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
