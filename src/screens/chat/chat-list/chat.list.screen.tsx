import React, { useMemo, useEffect } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./chat.list.screen.style";
import { getListChat } from "@services/api/chatApi";
import ChatItem from "../chat-room/components/ChatItem";
import { TypedGeneralRoomChat } from "@services/models/ChatModels";
import ListFriend from "./friend.list.view";
import { translations } from "@localization";
import FriendSearchInput from "../search-room/search.room.input";
import LoadingList from "@shared-components/loading.list.component";
import { useListData } from "@helpers/hooks/use.list.data";
import EmptyResultView from "@shared-components/empty.data.component";
import eventEmitter from "@services/event-emitter";

interface ListScreenProps {}

const ListChatScreen: React.FC<ListScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const { colors } = theme;
  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    refreshListPage,
  } = useListData<TypedGeneralRoomChat>({ limit: 6 }, getListChat);

  useEffect(() => {
    eventEmitter.on("refresh_list_chat", refreshListPage);
    return () => {
      eventEmitter.off("refresh_list_chat", refreshListPage);
    };
  });
  const renderItem = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    return <ChatItem {...item} key={index} />;
  };

  console.log("chat list", listData);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>{translations.navigation.messages}</Text>
      <FriendSearchInput fromChatList />
      <View style={{ height: 12 }} />
      <ListFriend />
      <View style={{ height: 8 }} />
      {isFirstLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && (
        <EmptyResultView
          title={translations.noNewMessageTittle}
          desc={translations.noNewMessageDesc}
          icon={"chatbubble-ellipses-outline"}
        />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listChat}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?.chat_room_id?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

export default React.memo(ListChatScreen);
