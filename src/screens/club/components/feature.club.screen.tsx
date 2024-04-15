import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import TitleClub from "./list.title.club";
import ItemClub from "./list.item.club";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import { getListGroup } from "@services/api/club.api";
import { useListData } from "@helpers/hooks/useListData";
import eventEmitter from "@services/event-emitter";

interface TypeListClub {
  avatar: any;
  createdAt: string;
  description: string;
  member_counter: number;
  name: string;
  updatedAt: string;
  user_id: any;
}

const FeatureClubScreen = () => {
  const paramsRequest = {
    limit: "5",
  };

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypeListClub>(paramsRequest, getListGroup, []);

  useEffect(() => {
    eventEmitter.on("reload_list_club", _requestData);
    return () => {
      eventEmitter.off("reload_list_club", _requestData);
    };
  }, []);

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderItemSelected = ({ item, index }) => {
    return <ItemClub data={item} key={index} />;
  };
  const renderHeader = () => {
    return <TitleClub textLeft={translations.club.title1} />;
  };

  return (
    <View style={styles.styleItem}>
      {listData.length == 0 && isLoading && renderLoading()}
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listData}
        ListHeaderComponent={renderHeader}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default FeatureClubScreen;

const styles = StyleSheet.create({
  styleItem: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingTop: 10,
  },
});
