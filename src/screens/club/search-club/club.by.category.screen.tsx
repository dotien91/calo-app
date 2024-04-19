import React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import lotieNoResult from "assets/lotties/no-result.json";
import { TypedGeneralRoomChat } from "models/chat.model";
import { useListSearch } from "@helpers/hooks/useListSearch";
import ItemClub from "../components/list.item.club";
import { getListGroup } from "@services/api/club.api";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";

interface ClubByCategoryScreenProps {}

const ClubByCategoryScreen: React.FC<ClubByCategoryScreenProps> = () => {
  const route = useRoute();
  const skills = route.params?.["skills"];

  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListSearch<TypedGeneralRoomChat>(
      { limit: "12", skills },
      getListGroup,
      [],
    );

  const renderItem = ({ item, index }) => {
    return <ItemClub data={item} key={index} />;
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={skills?.[0]} />
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

export default ClubByCategoryScreen;
