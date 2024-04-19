import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

import {
  TypedChatMediaLocal,
  TypedDataMediaChatHistory,
} from "models/chat.model";
import VideoPlayer from "@shared-components/video.player.component";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { ViewStyle } from "react-native-size-matters";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";

interface IMediasView {
  data: TypedChatMediaLocal[];
  fromProfileChat: boolean;
  status?: string;
  customStyleBox?: ViewStyle;
  width: number;
  chatRoomId: string;
  fromMediaScreen: boolean;
  disabled?: boolean;
}
const IMG_MEDIA = (Device.width - 8) / 3;

const ChatProfileMediaView = ({
  data,
  width,
  customStyleBox,
  chatRoomId,
  fromMediaScreen,
  disabled = false,
}: IMediasView) => {
  const currentMediaIds = useStore((state) => state.currentMediaIds);

  const openMediaModal = (item: TypedChatMediaLocal) => {
    const currentMediaData =
      currentMediaIds.find((item) => item?.id == chatRoomId)?.data || [];
    const listMedia = currentMediaData.filter(
      (i: TypedDataMediaChatHistory) =>
        (i?.media_mime_type || "").includes("image") ||
        (i?.media_mime_type || "").includes("video"),
    );
    const index = (fromMediaScreen ? data : listMedia).findIndex(
      (_item: TypedDataMediaChatHistory) => _item.media_url == item.media_url,
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia: fromMediaScreen ? data : listMedia,
        index,
      },
    });
  };

  const renderItem = (item: TypedChatMediaLocal, index: number) => {
    console.log("itemmm", item);
    if (!item) return null;
    if (item.media_type.includes("image")) {
      return (
        <TouchableOpacity
          disabled={disabled}
          key={index}
          onPress={() => openMediaModal(item)}
        >
          <FastImage
            key={index}
            source={{ uri: item.media_url }}
            style={{
              width: IMG_MEDIA,
              height: IMG_MEDIA,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    if (item.media_type?.includes("video")) {
      return (
        <TouchableOpacity
          disabled={disabled}
          key={index}
          style={{ width: width, height: width }}
          onPress={() => openMediaModal(item)}
        >
          <VideoPlayer
            mediaUrl={item.media_url}
            width={IMG_MEDIA}
            height={IMG_MEDIA}
            resizeMode="cover"
            pressable={false}
            mediaThumbail={item?.media_thumbnail}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={customStyleBox ? customStyleBox : styles.box}>
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
    ...CS.flexRear,
    flexWrap: "wrap",
  },
  boxItem: {
    marginBottom: 4,
  },
});

export default memo(ChatProfileMediaView);
