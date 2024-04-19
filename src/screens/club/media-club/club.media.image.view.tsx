import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import MasonryList from "@react-native-seoul/masonry-list";

import { TypedChatMediaLocal } from "models/chat.model";
import VideoPlayer from "@shared-components/video.player.component";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { Device } from "@utils/device.ui.utils";
import { TypedMedia } from "shared/models";
import { useRoute } from "@react-navigation/native";
import { useListData } from "@helpers/hooks/useListData";
import { MediaType } from "react-native-image-picker";
import { getMediaClub } from "@services/api/club.api";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";

const IMG_MEDIA = (Device.width - 8) / 3;

const ClubMediaImageView = () => {
  const route = useRoute();
  const clubId = route.params?.["club_id"];
  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListData<MediaType>(
      {
        group_id: clubId,
        media_type: "image",
        order_by: "DESC",
        sort_by: "createdAt",
        limit: 18,
      },
      getMediaClub,
    );

  const openMediaModal = (item: TypedChatMediaLocal) => {
    const index = listData.findIndex(
      (_item: TypedMedia) => _item.media_url == item.media_url,
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia: listData,
        index,
      },
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedChatMediaLocal;
    index: number;
  }) => {
    if (item.media_type.includes("image")) {
      return (
        <TouchableOpacity key={index} onPress={() => openMediaModal(item)}>
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
    <View style={styles.box}>
      {!isLoading && !listData.length && (
        <EmptyResultView title={translations.notFound} />
      )}
      <MasonryList
        data={listData}
        renderItem={renderItem}
        numColumns={3}
        onEndReached={onEndReach}
        ListFooterComponent={renderFooterComponent()}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
  },
});

export default memo(ClubMediaImageView);
