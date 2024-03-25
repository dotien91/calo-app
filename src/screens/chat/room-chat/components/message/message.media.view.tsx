import React, { memo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import FastImage from "react-native-fast-image";

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
import { ViewStyle } from "react-native-size-matters";
import { openUrl } from "@helpers/file.helper";
import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
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
const IMG_WIDTH = 76;
const IMG_HEIGHT = 76;
const VIDEO_WIDTH = 115;
const VIDEO_HEIGHT = 67;

const MessageMediaView = ({
  data,
  fromProfileChat,
  status,
  width,
  customStyleBox,
  chatRoomId,
  fromMediaScreen,
  disabled = false,
}: IMediasView) => {
  const currentMediaIds = useStore((state) => state.currentMediaIds);
  const isPending = React.useMemo(() => {
    return status == EnumMessageStatus.Pending;
  }, [status]);
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
              width: width || IMG_WIDTH,
              height: width || IMG_HEIGHT,
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
          style={{ width: width || 115, height: width || 67 }}
          onPress={() => openMediaModal(item)}
        >
          <VideoPlayer
            mediaUrl={item.media_url}
            width={width || VIDEO_WIDTH}
            height={width || VIDEO_HEIGHT}
            resizeMode="cover"
            pressable={false}
            mediaThumbail={item?.media_thumbnail}
          />
          {isPending && (
            <ActivityIndicator
              size={"small"}
              color={palette.primary}
              style={{ position: "absolute", right: 5, bottom: 5 }}
            />
          )}
        </TouchableOpacity>
      );
    }
    if (item.media_mime_type == "application/pdf") {
      if (fromProfileChat) {
        return (
          <View
            key={index}
            style={{
              width,
              height: width,
              ...CS.flexCenter,
              ...CS.borderStyle,
              borderWidth: 2,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={"file"}
              size={40}
            />
          </View>
        );
      }
      return (
        <PressableBtn
          key={index}
          disable={isPending || disabled}
          onPress={() => openUrl(item.media_url)}
          style={{ width: Device.width * 0.75, opacity: isPending ? 0.5 : 1 }}
        >
          <Text style={CS.txtLink}>{item?.media_file_name || item?.name}</Text>
        </PressableBtn>
      );
    }
    if (
      (item.media_type == "audio/mpeg" || item.media_type == "file") &&
      fromProfileChat
    ) {
      return (
        <View
          key={index}
          style={{
            width,
            height: width,
            ...CS.flexCenter,
            ...CS.borderBottomStyle,
            borderWidth: 2,
            borderRadius: 12,
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

    if (
      item.media_type?.includes("audio") ||
      item.media_mime_type?.includes("audio")
    ) {
      return (
        <MessageAudio
          key={index}
          isMyMessage={true}
          itemAudio={item}
          disabled={isPending}
          // onLongPress={onLongPressMediaMessage}
        />
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
    ...CS.flexStart,
    flexWrap: "wrap",
  },
  boxItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
    marginBottom: 8,
    // flex: 1,
  },
});

export default memo(MessageMediaView);
