import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import * as React from "react";
import { StyleSheet, SafeAreaView, View, FlatList } from "react-native";
import ItemReview from "../components/ItemReview";
import { useListData } from "@helpers/hooks/useListData";
import { ListReview } from "@services/api/podcast.api";
import LoadingList from "@shared-components/loading.list.component";

const ShowAllReview = () => {
  // gọi API Lấy danh sách review

  const paramsRequest = {
    limit: 5,
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
    return <View />;
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
