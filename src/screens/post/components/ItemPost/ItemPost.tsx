/* eslint-disable camelcase */

import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { convertLastActive } from "./time";
import Icon from "react-native-vector-icons/Ionicons";
import { postLike } from "@services/api/post";
import { showToast } from "@helpers/SuperModalHelper";
import { translations } from "@localization";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const GAP_HEADER = 10;
const FONT_SIZE = 16;
const PADDING_LEFT = 12;
const SIZE_IMAGE = width - PADDING_HORIZONTAL * 2 - PADDING_LEFT - SIZE_AVATAR;

interface ItemPostProps {
  data: any;
  pressMore: () => void;
  pressComment: () => void;
  pressImageVideo: (index: number) => void;
}

const ItemPost = ({
  data,
  pressMore,
  pressComment,
  pressImageVideo,
}: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isHearted, setIsHearted] = useState<boolean>(false);
  const [likeNumber, setLikeNumber] = useState<number>(0);

  useEffect(() => {
    setIsHearted(data?.is_like);
    setLikeNumber(data?.like_number);
  }, [data]);

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
            flex: 1,
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
        <Pressable onPress={pressMore}>
          <Icon size={20} name="ellipsis-vertical" />
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
        <Icon size={62} name={"play-circle"} color={colors.baseColor2} />
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
        {listMedia.map((item, index) => {
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
    setIsHearted((isHearted) => !isHearted);
    postLike(params).then((res) => {
      if (!res.isError) {
        setLikeNumber(res.like_number);
      } else {
        setIsHearted((isHearted) => !isHearted);
        showToast({
          type: "error",
          message: translations.post.likeError,
        });
      }
    });
  };

  const pressShare = () => {
    console.log("share");
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
            name={isHearted ? "heart" : "heart-outline"}
            color={isHearted ? colors.primary : colors.text}
          />

          <Text style={styles.textLikeShare}>{likeNumber}</Text>
        </Pressable>
        <Pressable
          onPress={pressComment}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Icon size={16} name="chatbubbles-outline" />
          <Text style={styles.textLikeShare}>
            {data?.comment_number || "0"}
          </Text>
        </Pressable>
        <Pressable
          onPress={pressShare}
          style={[styles.viewLike, { justifyContent: "flex-end" }]}
        >
          <Icon size={16} name="share-social-outline" />
          <Text style={styles.textLikeShare}>Share</Text>
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
        <View style={{ paddingLeft: PADDING_LEFT, flex: 1 }}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: 2,
    backgroundColor: palette.background,
    paddingTop: 14,
    paddingBottom: 4,
  },
  image11: {
    minHeight: SIZE_IMAGE,
    width: SIZE_IMAGE,
    paddingVertical: 4,
    // borderRadius: BORDER_RADIUS1,
  },

  containerLikeShare: {
    flexDirection: "row",
    marginVertical: 4,
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 20,
  },
  viewLike: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textLikeShare: {
    ...CommonStyle.hnRegular,
    fontSize: FONT_SIZE,
    color: palette.text,
    marginLeft: 8,
  },
});

export default ItemPost;
