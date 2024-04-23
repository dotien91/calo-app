import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ItemEvent from "./item.event";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { TypeListEvent, getListEventGroup } from "@services/api/event.api";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";
import { palette } from "@theme/themes";
import EmptyResultView from "@shared-components/empty.data.component";
import CommonStyle from "@theme/styles";

const PastEvent = ({ club_id }) => {
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

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View
        style={{
          ...CommonStyle.center,
          backgroundColor: palette.background,
        }}
      >
        <EmptyResultView
          title={translations.event.emptyEventTitle}
          desc={translations.event.emptyEventDes}
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

export default PastEvent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
});
