import React, { useMemo, useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./chat.list.screen.style";
import { getListFriend } from "@services/api/chatApi";
import { TypedGeneralRoomChat } from "models/chat.model";
import Avatar from "@shared-components/user/Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";

interface ListFriendProps {}

const ListFriend: React.FC<ListFriendProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [listFriend, setListFriend] = useState([]);

  useEffect(() => {
    getListFriend().then((res) => {
      if (!res.isError) {
        setListFriend(res.data);
      }
    });
  }, []);

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
            width: 64,
            height: 64,
            borderRadius: 20,
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
