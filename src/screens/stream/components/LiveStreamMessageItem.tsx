import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Avatar from "@shared-components/user/Avatar";
import { TypedChatHistory } from "models/chat.model";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

const avatarSize = 30;

const LiveStreamMessageItem = ({
  chat_content,
  createBy,
}: TypedChatHistory) => {
  const sourceUri = createBy?.user_avatar || createBy?.user_avatar_thumbnail;
  const displayName = createBy?.display_name || " ";
  return (
    <View style={styles.box}>
      {!!sourceUri && (
        <Avatar
          sourceUri={{
            uri: sourceUri,
          }}
          resizeMode="cover"
          style={{
            width: avatarSize,
            height: avatarSize,
            marginRight: 4,
            borderRadius: 99,
          }}
        />
      )}
      <Text>
        <Text style={styles.txtName}>
          {displayName.length < 15
            ? `${displayName} `
            : `${displayName.substring(0, 12)}...`}{" "}
        </Text>
        <Text style={styles.txt}>{chat_content}</Text>
      </Text>
    </View>
  );
};

const styles: any = StyleSheet.create({
  box: {
    paddingHorizontal: 12,
    marginBottom: 10,
    ...CommonStyle.flexStart,
    flex: 1,
  },
  txt: {
    ...CommonStyle.hnRegular,
    fontSize: 14,
    color: palette.white,
    marginRight: 4,
  },
  txtName: {
    ...CommonStyle.hnMedium,
    fontSize: 14,
    color: palette.white,
    width: 100,
    flex: 1,
  },
});

export default React.memo(LiveStreamMessageItem);
