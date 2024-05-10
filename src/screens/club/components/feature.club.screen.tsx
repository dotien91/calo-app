import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import TitleClub from "./list.title.club";
import ItemClub from "./list.item.club";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import { getListGroup } from "@services/api/club.api";
import { useListData } from "@helpers/hooks/useListData";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";
import { useApi } from "@helpers/hooks/useApi";
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

const FeatureClubScreen = () => {
  const paramsRequest = {
    limit: "12",
  };

  const userData = useStore((store) => store.userData);

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypeListClub>(paramsRequest, getListGroup, [], userData);

  const { data, _requestData: reloadElitClub } = useApi<TypeListClub>({
    params: { isEliteClub: true },
    requestData: getListGroup,
  });

  useEffect(() => {
    _requestData(true);
    reloadElitClub(true);
  }, [userData?._id]);
  console.log("datadata", data);
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
    if (item?.isEliteClub) return null;
    return <ItemClub data={item} key={index} />;
  };

  const renderEmpty = () => {
    return <EmptyResultView title={translations.club.emptyClub} />;
  };

  const renderHeader = () => {
    return (
      <>
        {!!data?.length && <ItemClub data={data[0]} />}
        {!listData.length && isLoading && renderLoading()}
        {!data?.length && !listData.length && !isLoading && renderEmpty()}
      </>
    );
  };

  return (
    <View style={styles.styleItem}>
      <TitleClub textLeft={translations.club.title1} />

      <FlatList
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
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

export default FeatureClubScreen;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 60,
  },
  styleItem: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop: 10,
  },
});
