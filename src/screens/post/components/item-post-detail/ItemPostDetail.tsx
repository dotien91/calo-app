/* eslint-disable camelcase */

import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { postLike } from "@services/api/post";
import { showToast } from "@helpers/SuperModalHelper";
import { translations } from "@localization";
import { sharePost } from "utils/share";
import useStore from "@services/zustand/store";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { convertLastActive } from "utils/time";
import createStyles from "./ItemPostDetail.style";
import { showStickBottom } from "@shared-components/stick-bottom/HomeStickBottomModal";

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
  const [isLike, setIsLike] = useState<boolean>(data?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(0);
  const listLike = useStore((state) => state.listLike);
  const updateListLike = useStore((state) => state.updateListLike);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (listLike.indexOf(data?._id) >= 0) {
      setIsLike(!data?.is_like);
      if (data.is_like) {
        setLikeNumber(data?.like_number - 1);
      } else {
        setLikeNumber(data?.like_number + 1);
      }
    } else {
      setIsLike(data?.is_like);
      setLikeNumber(data?.like_number);
    }
  }, [listLike, data]);

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
          color: colors.mainColor2,
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

  const pressLike = async () => {
    const params = {
      community_id: data._id,
    };
    updateListLike(data._id);
    postLike(params).then((res) => {
      if (!res.isError) {
        setLikeNumber(res.like_number);
      } else {
        updateListLike(data._id);
        showToast({
          type: "error",
          message: translations.post.likeError,
        });
      }
    });
  };

  const LikeShare = () => {
    return (
      <View style={styles.containerLikeShare}>
        <Pressable
          onPress={pressLike}
          style={[styles.viewLike, { justifyContent: "flex-start" }]}
        >
          <Icon
            size={16}
            name={isLike ? "heart" : "heart-outline"}
            type={IconType.Ionicons}
            color={isLike ? colors.primary : colors.text}
          />

          <Text style={styles.textLikeShare}>{likeNumber}</Text>
        </Pressable>
        <Pressable
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
        </Pressable>
        <Pressable
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
        </Pressable>
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
