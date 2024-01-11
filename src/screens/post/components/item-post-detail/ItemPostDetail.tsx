/* eslint-disable camelcase */

import React, { useMemo } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { sharePost } from "@utils/share.utils";
import { convertLastActive } from "@utils/time.utils";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./ItemPostDetail.style";
import { showStickBottom } from "@shared-components/stick-bottom/HomeStickBottomModal";
import LikeBtn from "@screens/home/components/like-btn/LikeBtn";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const GAP_HEADER = 10;
const FONT_SIZE = 16;
const PADDING_LEFT = 12;

interface ItemPostProps {
  data: any;
  pressComment: () => void;
  pressImageVideo: (index: number) => void;
}

const ItemPost = ({ data, pressComment, pressImageVideo }: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const _showStickBottom = () => {
    showStickBottom(data, "post");
  };

  const Avatar = useMemo(() => {
    return (
      <View
        style={{
          width: SIZE_AVATAR,
          height: SIZE_AVATAR,
          borderRadius: BORDER_AVATAR,
        }}
      >
        <Image
          source={{ uri: data?.user_id?.user_avatar_thumbnail }}
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
      </View>
    );
  }, [data]);

  const HeaderItemPost = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: GAP_HEADER,
            ...CommonStyle.flex1,
          }}
        >
          <Text
            style={{
              ...CommonStyle.hnBold,
              fontSize: FONT_SIZE,
              color: colors.mainColor2,
            }}
          >
            {data?.user_id?.display_name}
          </Text>
          {data?.user_id?.official_status && (
            <IconSvg name="icVerify" size={14} />
          )}
          <View
            style={{
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: colors.text,
            }}
          />
          <Text
            style={{
              ...CommonStyle.hnRegular,
              color: colors.text,
              fontSize: FONT_SIZE,
            }}
          >
            {convertLastActive(data?.createdAt)}
          </Text>
        </View>
        <Pressable onPress={_showStickBottom}>
          <Icon
            size={20}
            name="ellipsis-vertical"
            type={IconType.Ionicons}
            color={colors.text}
          />
        </Pressable>
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
            ...CommonStyle.hnBold,
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
          ...CommonStyle.hnRegular,
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
          ...CommonStyle.fillParent,
          zIndex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          size={62}
          name={"play-circle"}
          type={IconType.Ionicons}
          color={colors.text}
        />
      </View>
    );
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
            <Pressable
              key={index}
              onPress={() => pressImageVideo(index)}
              style={styles.image11}
            >
              <Image
                style={styles.image11}
                source={{ uri: item.media_thumbnail }}
              />
              {item.media_mime_type.includes("video") && <PlayVideo />}
            </Pressable>
          );
        })}
      </View>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const LikeShare = () => {
    return (
      <View style={styles.containerLikeShare}>
        <LikeBtn data={data} />
        <TouchableOpacity
          onPress={pressComment}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Icon
            size={16}
            name="chatbubbles-outline"
            type={IconType.Ionicons}
            color={colors.text}
          />
          <Text style={styles.textLikeShare}>
            {data?.comment_number || "0"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sharePost(data.post_slug)}
          style={[styles.viewLike, { justifyContent: "flex-end" }]}
        >
          <Icon
            size={16}
            name="share-social-outline"
            type={IconType.Ionicons}
            color={colors.text}
          />
          <Text style={styles.textLikeShare}>{translations.post.share}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
      }}
    >
      <View style={styles.container}>
        {Avatar}
        <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
          {HeaderItemPost}
          {HasTag}
          {ContentStatus}
          {ListFile}
          <LikeShare />
        </View>
      </View>
    </View>
  );
};

export default ItemPost;
