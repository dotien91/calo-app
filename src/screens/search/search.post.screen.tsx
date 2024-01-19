import React, { useMemo, useState } from "react";
import { View, FlatList, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./search.post.screen.style";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import lotieNoResult from "assets/lotties/no-result.json";
import { useListData } from "@helpers/hooks/useListData";
import ItemPost from "@screens/home/components/post-item/post.item";
import { getListPost } from "@services/api/post";
import PostSearchInput from "./search.post.input";
import { TypedPost } from "shared/models";

interface SearchPostScreenProps {}

const SearchPostScreen: React.FC<SearchPostScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const { colors } = theme;
  const [txtSearch, setTxtSearch] = useState("");

  const {
    listData,
    isLoading,
    onEndReach,
    isFirstLoading,
    renderFooterComponent,
  } = useListData<TypedPost>(
    { limit: 8, search: txtSearch.trim() },
    getListPost,
    [],
  );

  const renderItem = ({ item }: any) => {
    return <ItemPost data={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <PostSearchInput setTxtSearch={setTxtSearch} />
      <View style={{ margin: 10 }} />
      {isLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listChat}
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

export default SearchPostScreen;
