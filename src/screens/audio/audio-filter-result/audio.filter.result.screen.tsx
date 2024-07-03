import { View, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInputWithFilter from "@shared-components/search-input-with-filter.tsx/search.input.with.filter";
import { GetPodCastList } from "@services/api/podcast.api";
import { useListData } from "@helpers/hooks/useListData";
import { TypeTrackLocal } from "models/audio.modal";
import useStore from "@services/zustand/store";
import LoadingList from "@shared-components/loading.list.component";
import AudioItemList from "../components/audio.item.list";
import EmptyResultView from "@shared-components/empty.data.component";

const AudioFilterResultScreen = () => {
  const userData = useStore((state) => state.userData);
  const textSearch = useStore((state) => state.courseSearchHistory);

  const {
    noData,
    listData,
    isLoading,
    onEndReach,
    // refreshControl,
    renderFooterComponent,
  } = useListData<TypeTrackLocal>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      limit: "10",
      podcast_category: "",
      search: textSearch,
    },
    GetPodCastList,
  );
  // console.log("lisDATA =====", listData)
  const _onSubmitEditing = () => {};

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderItem = ({ item, index }) => {
    if (item?.is_join) {
      return null;
    } else {
      return (
        <AudioItemList
          listData={listData}
          isSliderItem
          data={item}
          key={index}
        />
      );
    }
  };

  const renderEmptyComponent = () => {
    if (!noData) return null;
    return <EmptyResultView />;
  };

  return (
    <SafeAreaView>
      <SearchInputWithFilter
        onSubmitEditing={_onSubmitEditing}
        showBackBtn={true}
        // setTxtSearch={setTxtSearch}
      />
      <View style={{ marginTop: 20 }}>
        {listData.length == 0 && isLoading ? (
          renderLoading()
        ) : (
          <FlatList
            //   ListHeaderComponent={renderHeader()}
            showsHorizontalScrollIndicator={false}
            data={listData}
            renderItem={renderItem}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingLeft: 16,
              paddingBottom: 80,
            }}
            initialNumToRender={2}
            onEndReachedThreshold={0}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?._id + ""}
            onEndReached={onEndReach}
            removeClippedSubviews={true}
            // refreshControl={refreshControl()}
            ListFooterComponent={renderFooterComponent()}
            ListEmptyComponent={renderEmptyComponent()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AudioFilterResultScreen;
