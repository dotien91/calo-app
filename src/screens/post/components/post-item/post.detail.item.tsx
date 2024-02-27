/* eslint-disable camelcase */

import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import createStyles from "./post.detail.item.style";

// import CommonStyle from "@theme/styles";
import HeaderPostItem from "@screens/home/components/post-item/header.post.item";
import AvatarPost from "@screens/home/components/post-item/avatar.post";
import LikeSharePostItem from "@screens/home/components/post-item/like.share.post.item";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { openUrl } from "@helpers/file.helper";

const SIZE_AVATAR = 30;
const FONT_SIZE = 16;
const PADDING_LEFT = 12;

interface ItemPostProps {
  data: any;
  pressComment: () => void;
  pressImageVideo: (index: number) => void;
}

const ItemPost = ({ data, pressComment }: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const HasTag = useMemo(() => {
    if (
      data &&
      data.post_category &&
      data.post_category.category_content &&
      data.post_category.category_content.trim() !== ""
    )
      return (
        <Text
          style={{
            ...CS.hnBold,
            fontSize: FONT_SIZE,
            color: colors.primary,
          }}
        >
          #{data.post_category.category_content}
        </Text>
      );
    return null;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const ContentStatus = useMemo(() => {
    return (
      <Text
        style={{
          ...CS.hnRegular,
          fontSize: FONT_SIZE,
          marginBottom: 4,
        }}
      >
        {data?.post_content}
      </Text>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const PlayVideo = () => {
    return (
      <View
        style={{
          ...CS.fillParent,
          zIndex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          size={62}
          name={"play-circle"}
          type={IconType.Ionicons}
          color={colors.primary}
        />
      </View>
    );
  };

  const showImageVideo = (index: number) => {
    const listMedia = data?.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia,
        index,
      },
    });
  };

  const ListFile = useMemo(() => {
    const listFile = data?.attach_files || [];
    const listMedia = listFile.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );

    return (
      <View style={{ alignItems: "flex-end" }}>
        {listMedia.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => showImageVideo(index)}
              style={styles.image11}
            >
              <Image
                style={styles.image11}
                source={{ uri: item.media_thumbnail }}
              />
              {item.media_mime_type.includes("video") && <PlayVideo />}
            </TouchableOpacity>
          );
        })}
        {listFile.map((item: any, index: number) => {
          return (
            <PressableBtn
              key={index}
              onPress={() => openUrl(item.media_url)}
              style={{ marginTop: 8 }}
            >
              <Text style={CS.txtLink}>{item?.media_file_name}</Text>
            </PressableBtn>
          );
        })}
      </View>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const gotoDetail = () => {};

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
      }}
    >
      <View style={styles.container}>
        <AvatarPost
          data={data}
          pressAvatar={gotoDetail}
          sizeAvatar={SIZE_AVATAR}
        />
        <View style={{ paddingLeft: PADDING_LEFT, ...CS.flex1 }}>
          <HeaderPostItem data={data} onPress={gotoDetail} isDetail={true} />
          {HasTag}
          {ContentStatus}
          {ListFile}
          <LikeSharePostItem data={data} pressComment={pressComment} />
        </View>
      </View>
    </View>
  );
};

export default React.memo(ItemPost);
