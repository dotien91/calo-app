import React, { useState } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
/**
 * ? Local Imports
 */
import SearchInput from "../../../shared/components/search-input.tsx/search.input";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import lotieNoResult from "assets/lotties/no-result.json";
import { TypedGeneralRoomChat } from "models/chat.model";
import { useListSearch } from "@helpers/hooks/useListSearch";
import ItemClub from "../components/list.item.club";
import { getListGroup } from "@services/api/club.api";
import CS from "@theme/styles";

interface SearchClubScreenProps {}

const SearchClubScreen: React.FC<SearchClubScreenProps> = () => {
  const [txtSearch, setTxtSearch] = useState("");

  const paramRequest = React.useMemo(() => {
    if (txtSearch) return { limit: "12", search: txtSearch };
    return { limit: "12" };
  }, [txtSearch]);

  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListSearch<TypedGeneralRoomChat>(paramRequest, getListGroup, []);

  const renderItem = ({ item, index }) => {
    return <ItemClub data={item} key={index} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <SearchInput setTxtSearch={setTxtSearch} showCancelBtn={true} />
      <View style={{ margin: 10 }} />
      {isLoading && <LoadingList />}
      {!listData?.length && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
});

export default SearchClubScreen;
