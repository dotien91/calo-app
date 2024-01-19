import React, { useMemo, useEffect } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./chat.list.screen.style";
import { getListChat } from "@services/api/chat.api";
import ChatItem from "./chat.item";
import ListFriend from "./friend.list.view";
import { translations } from "@localization";
import SearchInput from "../../../shared/components/search-input.tsx/search.input";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import eventEmitter from "@services/event-emitter";
import { useListData } from "@helpers/hooks/useListData";
import { TypedGeneralRoomChat, TypedUserChat } from "models/chat.model";
import { onSocket, offSocket } from "@helpers/socket.helper";
import { SCREENS } from "constants";

interface ListScreenProps {}

const ListChatScreen: React.FC<ListScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const listDataRef = React.useRef([]);
  // const route = useRoute();
  // const paramsFromNavigation = route.params?.["groupData"];

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
    setListData,
  } = useListData<TypedGeneralRoomChat>({ limit: 6 }, getListChat);

  const onRefresh = () => {
    _requestData(false);
  };

  const msgToUser = (data: string) => {
    const newChatItem: TypedUserChat = JSON.parse(data)?.chat_room_data;
    if (!newChatItem) return;
    const indexNewChatItem = listDataRef.current.findIndex(
      (item) => newChatItem.chat_room_id._id == item.chat_room_id._id,
    );
    if (indexNewChatItem > -1) {
      const currentItem = listDataRef.current[indexNewChatItem];
      listDataRef.current.splice(indexNewChatItem, 1);
      listDataRef.current.unshift({
        ...currentItem,
        chat_room_id: {
          ...currentItem.chat_room_id,
          last_message: newChatItem.chat_room_id.last_message,
        },
        read_count: currentItem.read_count + 1,
      });
    } else {
      listDataRef.current.unshift({
        ...newChatItem,
        chat_room_id: {
          ...newChatItem.chat_room_id,
          room_name: newChatItem.room_title,
        },
      });
    }
    setListData(listDataRef.current);
  };

  useEffect(() => {
    // if (paramsFromNavigation) {
    //   // id: messageItem?.chat_room_id,
    //   //   partner_name: partner?.display_name,
    //   //   partner
    //   NavigationService.navigate(SCREENS.CHAT_ROOM, {
    //     id: paramsFromNavigation?.id,
    //   });
    // }
    onSocket("msgToUser", msgToUser);
    eventEmitter.on("refresh_list_chat", onRefresh);

    return () => {
      offSocket("msgToUser", msgToUser);
      eventEmitter.off("refresh_list_chat", onRefresh);
    };
  });

  useEffect(() => {
    listDataRef.current = listData;
  }, [listData]);

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    return <ChatItem {...item} key={index} />;
  };

  const openSearchRoom = () => {
    NavigationService.navigate(SCREENS.SEARCH_CHAT);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>{translations.navigation.messages}</Text>
      <SearchInput onPressInput={openSearchRoom} />
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
