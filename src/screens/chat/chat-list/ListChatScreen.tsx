import React, { useMemo } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ListChatScreen.style";
import { getListChat } from "@services/api/chatApi";
import ChatItem from "../chat-room/components/ChatItem";
import { TypedGeneralRoomChat } from "@services/models/ChatModels";
import ListFriend from "./ListFriend";
import { translations } from "@localization";
import FriendSearchInput from "../search-room/FriendSearchInput";
import LoadingList from "@shared-components/LoadingList";
import { useListData } from "@helpers/hooks/useListData";
import EmptyResultView from "@shared-components/EmptyResultView";

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
  } = useListData<TypedGeneralRoomChat>({ limit: 6 }, getListChat);

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
