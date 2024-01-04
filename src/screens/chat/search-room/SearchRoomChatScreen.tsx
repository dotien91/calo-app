import React, { useMemo, useState } from "react";
import { View, FlatList, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "../chat-list/ListChatScreen.style";
import { getListChat } from "@services/api/chatApi";
import ChatItem from "../chat-room/components/ChatItem";
import { TypedGeneralRoomChat } from "@services/models/ChatModels";
import FriendSearchInput from "./FriendSearchInput";
import LoadingList from "@shared-components/LoadingList";
import { useListData } from "@helpers/hooks/useListData";
import EmptyResultView from "@shared-components/EmptyResultView";
import { translations } from "@localization";
import lotieNoResult from "assets/lotties/no-result.json";

interface SearchRoomChatScreenProps {}

const SearchRoomChatScreen: React.FC<SearchRoomChatScreenProps> = () => {
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
  } = useListData<TypedGeneralRoomChat>(
    { limit: 8, search: txtSearch },
    getListChat,
    [],
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    console.log("itemitem", item);
    return <ChatItem {...item} key={index} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FriendSearchInput setTxtSearch={setTxtSearch} />
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
        keyExtractor={(item) => item?.chat_room_id?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

export default SearchRoomChatScreen;
