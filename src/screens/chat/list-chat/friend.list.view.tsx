import React, { useMemo, useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./chat.list.screen.style";
import { getListFriend } from "@services/api/chat.api";
import { TypedGeneralRoomChat } from "models/chat.model";
import Avatar from "@shared-components/user/Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";

interface ListFriendProps {}

const ListFriend: React.FC<ListFriendProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [listFriend, setListFriend] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useStore((state) => state.userData);

  const _getListFriend = () => {
    getListFriend({}).then((res) => {
      if (!res.isError) {
        setListFriend(res.data);
      } else {
        setListFriend([]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    eventEmitter.on("reload_list_friend", _getListFriend);
    return () => {
      eventEmitter.off("reload_list_friend", _getListFriend);
    };
  }, []);

  useEffect(() => {
    _getListFriend();
  }, [userData]);

  const openChatRoom = (item: any) => {
    const { partner_id } = item;
    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      partner_id: partner_id?._id,
      partner_name: partner_id?.display_name,
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedGeneralRoomChat;
    index: number;
  }) => {
    const partnerId = item.partner_id;
    return (
      <TouchableOpacity
        style={{ marginRight: 8, width: 68 }}
        onPress={() => openChatRoom(item)}
        key={index}
      >
        <Avatar
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
          }}
          sourceUri={{
            uri: partnerId?.user_avatar || partnerId?.user_avatar_thumbnail,
          }}
          resizeMode={"cover"}
        />
        <Text numberOfLines={1} style={styles.friendNameTxt}>
          {partnerId?.display_name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{}}>
      {loading && <LoadingList />}
      <FlatList
        horizontal={true}
        data={listFriend}
        renderItem={renderItem}
        contentContainerStyle={styles.listFriend}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
      />
    </View>
  );
};

export default React.memo(ListFriend);
