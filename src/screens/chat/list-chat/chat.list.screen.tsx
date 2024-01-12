import React, { useMemo, useEffect } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./chat.list.screen.style";
import { getListChat } from "@services/api/chatApi";
import ChatItem from "../room-chat/components/ChatItem";
import ListFriend from "./friend.list.view";
import { translations } from "@localization";
import FriendSearchInput from "../search-room/search.room.input";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import eventEmitter from "@services/event-emitter";
import { useListData } from "@helpers/hooks/useListData";
import { TypedGeneralRoomChat, TypedUserChat } from "models/chat.model";
import { onSocket, offSocket } from "@helpers/socket.helper";

interface ListScreenProps {}

const ListChatScreen: React.FC<ListScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const listDataRef = React.useRef([]);
  // const { colors } = theme;
  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    refreshListPage,
    setListData,
  } = useListData<TypedGeneralRoomChat>({ limit: 6 }, getListChat);

  const _refreshListChat = () => {
    refreshListPage(false);
  };

  useEffect(() => {
    onSocket("msgToUser", msgToUser);
    eventEmitter.on("refresh_list_chat", _refreshListChat);

    return () => {
      offSocket("msgToUser", msgToUser);
      eventEmitter.off("refresh_list_chat", _refreshListChat);
    };
  });

  useEffect(() => {
    listDataRef.current = listData;
  }, [listData]);

  const msgToUser = (data: string) => {
    const newChatItem: TypedUserChat = JSON.parse(data)?.chat_room_data;
    if (!newChatItem) return;
    const indexNewChatItem = listDataRef.current.findIndex(
      (item) => newChatItem.chat_room_id._id == item.chat_room_id._id,
    );
    if (indexNewChatItem > -1) {
      const currentItem = listDataRef.current[indexNewChatItem];
      listDataRef.current[indexNewChatItem] = {
        ...currentItem,
        chat_room_id: {
          ...currentItem.chat_room_id,
          last_message: newChatItem.chat_room_id.last_message,
        },
        read_count: currentItem.read_count + 1,
      };
    } else {
      listDataRef.current.unshift(newChatItem);
    }
    console.log(
      "isnewRoom",
      { newChatItem, indexNewChatItem },
      listDataRef.current,
    );
    setListData(listDataRef.current);
  };

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
