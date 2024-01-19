import React, { memo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import FastImage from "react-native-fast-image";

import CommonStyle from "@theme/styles";
import {
  TypedChatMediaLocal,
  TypedDataMediaChatHistory,
} from "models/chat.model";
import VideoPlayer from "../../../../../shared/components/video.player.component";
import MessageAudio from "@screens/chat/room-chat/components/audio/MessageAudio";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { EnumMessageStatus } from "constants/chat.constant";
import { palette } from "@theme/themes";

interface IMediasView {
  data: TypedChatMediaLocal[];
  fromProfileChat: boolean;
  status?: string;
}
const IMG_WIDTH = 76;
const IMG_HEIGHT = 76;
const VIDEO_WIDTH = 115;
const VIDEO_HEIGHT = 67;

const MessageMediaView = ({ data, fromProfileChat, status }: IMediasView) => {
  const currentMediaIds = useStore((state) => state.currentMediaIds);

  const openMediaModal = (item: TypedChatMediaLocal) => {
    const listMedia = currentMediaIds.filter(
      (i: TypedDataMediaChatHistory) =>
        (i?.media_mime_type || "").includes("image") ||
        (i?.media_mime_type || "").includes("video"),
    );
    const index = listMedia.findIndex(
      (_item: TypedDataMediaChatHistory) => _item.media_url == item.media_url,
    );
    console.log("indexindex", index);
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia,
        index,
      },
    });
  };

  const renderItem = (item: TypedChatMediaLocal, index: number) => {
    const renderStatus = () => {
      if (status != EnumMessageStatus.Pending) return null;
      return (
        <ActivityIndicator
          size={"small"}
          color={palette.primary}
          style={{ position: "absolute", right: 5, bottom: 5 }}
        />
      );
    };

    if (item.media_type.includes("image")) {
      return (
        <TouchableOpacity onPress={() => openMediaModal(item)}>
          <FastImage
            key={index}
            source={{ uri: item.media_url }}
            style={{
              width: IMG_WIDTH,
              height: IMG_HEIGHT,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    if (item.media_type?.includes("video")) {
      return (
        <TouchableOpacity
          style={{ width: 115, height: 67 }}
          onPress={() => openMediaModal(item)}
        >
          <VideoPlayer
            mediaUrl={item.media_url}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            resizeMode="cover"
            pressable={false}
            mediaThumbail={item?.media_thumbnail}
          />
          {renderStatus()}
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
            width: IMG_WIDTH,
            height: IMG_HEIGHT,
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

export default memo(MessageMediaView);
