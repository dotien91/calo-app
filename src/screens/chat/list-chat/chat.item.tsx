import React, { useState, useMemo } from "react";
import { View, Text } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useTheme } from "@react-navigation/native";
import createStyles from "./chat.list.screen.style";
import { TouchableOpacity } from "react-native-gesture-handler";
import Avatar from "@shared-components/user/Avatar";
import { TypedGeneralRoomChat } from "models/chat.model";
import { getFormatDayMessage } from "@utils/date.utils";
import CommonStyle from "@theme/styles";
import { setViewRoom } from "@services/api/chat.api";
import { SCREENS } from "constants";

const avatarSize = 64;

const ChatItem = ({
  read_count,
  chat_room_id,
  partner_id,
  last_updated,
  room_type,
}: TypedGeneralRoomChat) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [readCount, setReadCount] = useState(read_count);
  const isGroup = room_type == "group";

  const { group_partners } = chat_room_id;
  React.useEffect(() => {
    setReadCount(read_count);
  }, [read_count]);

  const onPress = () => {
    if (read_count) {
      setViewRoom(chat_room_id?._id);
      setReadCount(0);
    }
    const groupName = chat_room_id?.room_name;

    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      id: chat_room_id?._id,
      partner_name: groupName || partner_id?.display_name,
      user: partner_id,
      isGroup: !!group_partners.length,
      chat_room_id,
    });
  };

  const sourceUri =
    partner_id?.user_avatar || partner_id?.user_avatar_thumbnail;
  const timeLastMessage = getFormatDayMessage(last_updated, "HH:mm", "DD/MM");

  const renderGroupAvatar = () => {
    const avatarGroup = group_partners.map(
      (item) => item.user_avatar || item.user_avatar_thumbnail,
    );
    return (
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          marginRight: 10,
          borderRadius: 20,
          ...CommonStyle.flexCenter,
        }}
      >
        <Avatar
          sourceUri={{
            uri: avatarGroup[0],
          }}
          resizeMode="cover"
          style={{
            width: avatarSize / 2,
            height: avatarSize / 2,
            borderRadius: 20,
          }}
        />
        <Avatar
          sourceUri={{
            uri: avatarGroup[1],
          }}
          resizeMode="cover"
          style={{
            width: avatarSize / 2,
            height: avatarSize / 2,
            borderRadius: 20,
          }}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.chatItem}>
      {isGroup ? (
        renderGroupAvatar()
      ) : (
        <Avatar
          sourceUri={{
            uri: sourceUri,
          }}
          resizeMode="cover"
          style={{
            width: avatarSize,
            height: avatarSize,
            marginRight: 10,
            borderRadius: 20,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <View style={CommonStyle.flexStart}>
          <Text>
            <Text numberOfLines={1} style={styles.partnerNameTxt}>
              {chat_room_id?.room_name}
            </Text>
            <Text style={styles.timeTxt}> • {timeLastMessage}</Text>
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.lastMessageTxt, !readCount && CommonStyle.hnRegular]}
        >
          {chat_room_id?.last_message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ChatItem);
