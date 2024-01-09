import React, { useMemo, useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./ListChatScreen.style";
import { getListFriend } from "@services/api/chatApi";
import { TypedGeneralRoomChat } from "@services/models/chatModel";
import Avatar from "@shared-components/user/Avatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

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
    console.log("itemitem", item);
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
      <TouchableOpacity onPress={() => openChatRoom(item)} key={index}>
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
        keyExtractor={(item) => item?.chat_room_id?._id + ""}
        // ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default React.memo(ListFriend);
