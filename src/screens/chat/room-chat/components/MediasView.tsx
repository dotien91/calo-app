import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CommonStyle from "@theme/styles";
import { TypedChatMediaLocal } from "@services/models/ChatModels";
import FastImage from "react-native-fast-image";
import VideoPlayer from "../../../../shared/components/video.player.component";
import MessageAudio from "@screens/chat/room-chat/components/audio/MessageAudio";
import { TouchableOpacity } from "react-native-gesture-handler";
import useStore from "@services/zustand/store";
import { showDetailImageView } from "@helpers/super.modal.helper";

interface IMediasView {
  data: TypedChatMediaLocal[];
  fromProfileChat: boolean;
}

const MediasView = ({ data, fromProfileChat }: IMediasView) => {
  const currentMediaIds = useStore((state) => state.currentMediaIds);
  const openMediaModal = (item) => {
    console.log("Data====", item);

    const listMedia = currentMediaIds.filter(
      (i: any) =>
        (i?.media_mime_type || "").includes("image") ||
        (i?.media_mime_type || "").includes("video"),
    );

    console.log("listMedialistMedia", listMedia);
    const listLink = listMedia.map((i: any) => ({
      url: i.media_url,
      type: i.media_type,
      media_meta: i.media_meta,
    }));
    const index = listLink.findIndex((_item) => _item.url == item.media_url);

    console.log("index====", {
      index,
      currentMediaIds,
      listLink,
      url: listLink[index],
    });
    showDetailImageView(listLink, index, listMedia[0].media_type);
  };

  const renderItem = (item: TypedChatMediaLocal, index: number) => {
    try {
      if (item.media_type.includes("image")) {
        return (
          <TouchableOpacity onPress={() => openMediaModal(item)}>
            <FastImage
              key={index}
              source={{ uri: item.media_url || item.uri }}
              style={{
                width: 76,
                height: 76,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }
      if (item.media_type == "video") {
        return (
          <TouchableOpacity onPress={() => openMediaModal(item)}>
            <VideoPlayer
              mediaUrl={item.media_url || item.uri}
              width={115}
              height={67}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }
      if (
        (item.media_type == "audio/mpeg" || item.media_type == "file") &&
        fromProfileChat
      ) {
        return (
          <View
            style={{
              width: 76,
              height: 76,
              ...CommonStyle.flexCenter,
              ...CommonStyle.borderBottomStyle,
              borderWidth: 2,
              overflow: "hidden",
            }}
          >
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={"microphone"}
              size={40}
            />
          </View>
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
    } catch {
      return null;
    }
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
    flexWrap: "wrap",
  },
  boxItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
    marginBottom: 8,
  },
});

export default memo(MediasView);
