import { getListLiveStream } from "@services/api/stream.api";
import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StreamCard from "./stream.card";
import eventEmitter from "@services/event-emitter";
import { PaginationProps, SwiperFlatList } from "react-native-swiper-flatlist";
import { useFocusEffect } from "@react-navigation/native";

const ListLiveStream = () => {
  const listRef = useRef(null);
  const [listDataStream, setListDataStream] = useState([]);

  const renderItem = ({ item }: any) => {
    if (item?.livestream_status)
      return <StreamCard key={item._id} data={item} />;
  };

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        _getListLiveStream();
      }, 1000);
    }, []),
  );

  useEffect(() => {
    eventEmitter.on("reload_list_stream", onRefresh);
    return () => {
      eventEmitter.off("reload_list_stream", onRefresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = () => {
    _getListLiveStream();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  const _getListLiveStream = () => {
    getListLiveStream().then((res) => {
      console.log(44444444, res)
      if (!res.isError) {
        const listDataStream = res.data.filter(
          // const listDataStream = fakedata.filter(
          (item) => item?.livestream_status == "live",
        );
        setListDataStream(listDataStream.reverse());
      }
    });
  };

  if (listDataStream.length == 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SwiperFlatList
        // autoplay
        autoplayDelay={2}
        autoplayLoop
        index={0}
        showPagination={listDataStream.length > 1}
        data={listDataStream}
        renderItem={renderItem}
        paginationActiveColor={palette.primary}
        paginationDefaultColor={palette.grey4}
        paginationStyleItemActive={{ width: 24, height: 6, borderRadius: 10 }}
        paginationStyleItemInactive={{ width: 6, height: 6, borderRadius: 10 }}
        PaginationComponent={Pagination}
      />
    </View>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  size,
  paginationIndex = 0,
  scrollToIndex,
  paginationDefaultColor = palette.grey4,
  paginationActiveColor = palette.primary,
  paginationStyleItem = {},
  paginationStyleItemActive = {},
  paginationStyleItemInactive = {},
  onPaginationSelectedIndex,
  paginationTapDisabled = false,
  e2eID = "",
}) => {
  return (
    <View style={[styles.containerScrollable]}>
      {Array.from({ length: size }).map((_, index) => (
        <TouchableOpacity
          testID={`${e2eID}_pagination_${index}`}
          style={[
            styles.pagination,
            paginationStyleItem,
            paginationIndex === index
              ? { backgroundColor: paginationActiveColor }
              : { backgroundColor: paginationDefaultColor },
            paginationIndex === index
              ? paginationStyleItemActive
              : paginationStyleItemInactive,
          ]}
          key={index}
          onPress={() => {
            scrollToIndex({ index });
            onPaginationSelectedIndex?.();
          }}
          disabled={paginationTapDisabled}
        />
      ))}
    </View>
  );
};

export default ListLiveStream;

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    marginVertical: 8,
    // height: ((WindowWidth - 40) / 19) * 10,
  },
  containerScrollable: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    bottom: 10,
    gap: 4,
  },
});
