import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import ItemReview from "../components/ItemReview";
import { useListData } from "@helpers/hooks/useListData";
import { ListReview } from "@services/api/podcast.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";

const ShowAllReview = () => {
  // gọi API Lấy danh sách review
  const route = useRoute();
  const id = route?.params?.id || "";

  const paramsRequest = {
    limit: 6,
    podcast_id: id,
  };
  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<any>(paramsRequest, ListReview, []);

  const renderItem = ({ item, index }) => {
    return <ItemReview key={index} type="vertical" item={item} />;
  };

  const renderEmpty = () => {
    return <EmptyResultView title={translations.podcast.emptyReview} />;
  };

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.podcast.showAllReview} />
      {isLoading && listData.length == 0 && renderLoading()}
      {!isLoading && listData.length == 0 && renderEmpty()}
      <FlatList
        style={{ flex: 1, paddingHorizontal: 16 }}
        // ListHeaderComponent={renderHeader}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

export default ShowAllReview;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
