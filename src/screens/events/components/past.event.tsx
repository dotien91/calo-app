import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ItemEvent from "./item.event";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { getListEventGroup } from "@services/api/event.api";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";

interface TypeListEvent {
  name: string;
  cover?: string;
  start_time: string;
  end_time: string;
  location?: string;
  group_id: string;
}

const PastEvent = () => {
  const paramsResquest = {
    limit: "3",
  };

  const {
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypeListEvent>(paramsResquest, getListEventGroup, []);

  useEffect(() => {
    eventEmitter.on("reload_list_event", _requestData);
    return () => {
      eventEmitter.off("reload_list_event", _requestData);
    };
  }, []);

  const data = React.useMemo(() => {
    return listData.slice(0, 15);
  }, [listData]);

  const renderHeader = () => {
    return (
      <TextBase
        title={translations.event.pastEvent}
        fontSize={16}
        fontWeight="700"
      />
    );
  };

  const renderItem = ({ item, index }) => {
    return <ItemEvent data={item} key={index} />;
  };

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  return (
    <View style={styles.container}>
      {listData.length == 0 && isLoading && renderLoading()}

      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
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

export default PastEvent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
});
