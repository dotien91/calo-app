import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import TitleClub from "./list.title.club";
import ItemClub from "./list.item.club";
import LoadingList from "@shared-components/loading.list.component";
import { SCREENS } from "constants";
import { useListData } from "@helpers/hooks/useListData";
import { getListGroup } from "@services/api/club.api";
import eventEmitter from "@services/event-emitter";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";

interface TypeListClub {
  avatar: any;
  createdAt: string;
  description: string;
  member_counter: number;
  name: string;
  updatedAt: string;
  user_id: any;
}

const ManagedClubScreen = () => {
  const userData = useStore((state) => state.userData);

  const paramsRequest = {
    limit: "5",
    user_id: userData?._id,
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
    return (
      <TitleClub
        textLeft={translations.club.title2}
        textRight={translations.club.create}
        onPressRight={() => {
          NavigationService.navigate(SCREENS.CREATE_CLUB_SCREEN);
        }}
      />
    );
  };

  return (
    <View style={styles.styleItem}>
      {listData.length == 0 && isLoading && renderLoading()}
      <FlatList
        style={CS.flex1}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={onEndReach}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  styleItem: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingTop: 10,
  },
});

export default ManagedClubScreen;
