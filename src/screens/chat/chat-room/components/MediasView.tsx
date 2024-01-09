import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

import CommonStyle from "@theme/styles";
import { TypedChatMediaLocal } from "@services/models/ChatModels";
import FastImage from "react-native-fast-image";
import VideoPlayer from "../../../../shared/components/video.player.component";
import MessageAudio from "@screens/chat/chat-room/components/audio/MessageAudio";

interface IMediasView {
  data: TypedChatMediaLocal[];
}

const MediasView = ({ data }: IMediasView) => {
  const renderItem = (item: TypedChatMediaLocal, index: number) => {
    if (item.media_type == "image") {
      return (
        <FastImage
          key={index}
          source={{ uri: item.media_url || item.uri }}
          style={{
            width: 76,
            height: 76,
          }}
          resizeMode="cover"
        />
      );
    }
    if (item.media_type == "video") {
      return (
        <VideoPlayer
          mediaUrl={item.media_url || item.uri}
          width={115}
          height={67}
          resizeMode="cover"
        />
      );
    }
    if (item.media_type == "audio/mpeg" || item.media_type == "file") {
      return (
        <MessageAudio
          isMyMessage={true}
          itemAudio={item}
          // onLongPress={onLongPressMediaMessage}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.box}>
      {data.map((item, index) => (
        <View key={index} style={styles.boxItem}>
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    ...CommonStyle.flexStart,
  },
  boxItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
    marginBottom: 8,
  },
});

export default memo(MediasView);
