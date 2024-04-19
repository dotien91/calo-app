import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import TextBase from "@shared-components/TextBase";
import ItemEvent from "./item.event";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { TypeListEvent, getListEventGroup } from "@services/api/event.api";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";
import { palette } from "@theme/themes";
import CS from "@theme/styles";

const UpcomingEvent = ({ club_id }) => {
  const paramsResquest = {
    limit: "3",
    group_id: club_id,
  };

  const {
    listData,
    isLoading,
    onEndReach,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<TypeListEvent>(paramsResquest, getListEventGroup, []);

  const reload = () => {
    _requestData(false);
  };

  useEffect(() => {
    eventEmitter.on("reload_list_event", reload);
    return () => {
      eventEmitter.off("reload_list_event", reload);
    };
  }, []);

  const data = React.useMemo(() => {
    console.log(
      "listdataEvent.............",
      JSON.stringify(listData, null, 2),
    );
    return listData.slice(0, 15);
  }, [listData]);

  const renderHeader = () => {
    return (
      <TextBase
        title={translations.event.upComing}
        fontSize={16}
        fontWeight="700"
      />
    );
  };

  const renderItem = ({ index, item }) => {
    return <ItemEvent key={index} data={item} />;
  };

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View
        style={{
          ...CS.center,
          backgroundColor: palette.background,
        }}
      >
        <EmptyResultView
          title={translations.post.emptyPostTitle}
          desc={translations.post.emptyPostDes}
          icon="document-text-outline"
          showLottie={false}
        />
      </View>
    );
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
        ListEmptyComponent={renderEmpty()}
      />
    </View>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
});
