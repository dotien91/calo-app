/* eslint-disable camelcase */

import React, { useMemo, useState } from "react";
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
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";
import { postLike } from "@services/api/post";
import { showToast } from "@helpers/SuperModalHelper";
import { sharePost } from "utils/share";
import { translations } from "@localization";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const GAP_HEADER = 10;
const GAP_IMAGE = 4;
const FONT_SIZE = 16;
const BORDER_RADIUS1 = 16;
const BORDER_RADIUS2 = 12;
const PADDING_LEFT = 12;
const SIZE_IMAGE1 = width - PADDING_HORIZONTAL * 2 - PADDING_LEFT - SIZE_AVATAR;
const SIZE_IMAGE2 = (SIZE_IMAGE1 - 4) / 2;

interface ItemPostProps {
  data: any;
  pressMore: () => void;
  disablePress?: boolean;
}

const ItemPost = ({ data, pressMore, disablePress = false }: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isLike, setIsLike] = useState<boolean>(data.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(data.like_number);
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
  const pressLike = async () => {
    setIsLike((isLike) => !isLike);
    const params = {
      community_id: data._id,
    };
    postLike(params).then((res) => {
      if (!res.isError) {
        setLikeNumber(res.like_number);
      } else {
        setIsLike((isLike) => !isLike);
        showToast({ type: "error", message: res.message });
      }
    });
  };

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
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

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
        numberOfLines={2}
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
    if (listMedia.length == 1) {
      return (
        <View style={styles.image11}>
          <Image
            style={styles.image11}
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </View>
      );
    }
    if (listMedia.length == 2) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <View style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </View>
          <View style={styles.image22}>
            <Image
              style={styles.image22}
              source={{ uri: listMedia[1].media_thumbnail }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </View>
        </View>
      );
    }
    if (listMedia.length == 3) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <View style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </View>
          <View style={{ flex: 1, gap: GAP_IMAGE }}>
            <View style={styles.image23}>
              <Image
                style={styles.image23}
                source={{ uri: listMedia[1].media_thumbnail }}
              />
              {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
            </View>
            <View style={styles.image33}>
              <Image
                style={styles.image33}
                source={{ uri: listMedia[2].media_thumbnail }}
              />
              {listMedia[2].media_mime_type.includes("video") && <PlayVideo />}
            </View>
          </View>
        </View>
      );
    }
    if (listMedia.length > 3) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <View style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </View>
          <View style={{ flex: 1, gap: GAP_IMAGE }}>
            <View style={{ flex: 1 }}>
              <Image
                style={{
                  flex: 1,
                  borderTopRightRadius: BORDER_RADIUS2,
                }}
                source={{ uri: listMedia[1].media_thumbnail }}
              />
              {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
            </View>
            <View style={{ flex: 1 }}>
              <Image
                style={{
                  flex: 1,
                  borderBottomRightRadius: BORDER_RADIUS2,
                }}
                source={{ uri: listMedia[2].media_thumbnail }}
              />
              <View
                style={{
                  ...CommonStyle.fillParent,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.blackOverlay,
                  borderBottomRightRadius: 12,
                }}
              >
                <Text style={{ color: colors.primary }}>
                  +{listMedia.length - 3}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressComment = () => {
    NavigationService.push(SCREENS.POST_DETAIL, {
      id: data._id,
      isComment: true,
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
            color={isLike ? colors.primary : colors.text}
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
          onPress={() => sharePost(data.post_slug)}
          style={[styles.viewLike, { justifyContent: "flex-end" }]}
        >
          <Icon size={16} name="share-social-outline" />
          <Text style={styles.textLikeShare}>{translations.post.share}</Text>
        </Pressable>
      </View>
    );
  };

  const detailScreen = () => {
    if (!disablePress) {
      NavigationService.push(SCREENS.POST_DETAIL, { id: data._id });
    }
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <View style={{ paddingLeft: PADDING_LEFT, flex: 1 }}>
        <Pressable onPress={detailScreen} style={{ flex: 1 }}>
          {HeaderItemPost}
          {HasTag}
          {ContentStatus}
          {ListFile}
        </Pressable>
        <LikeShare />
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
    height: SIZE_IMAGE1,
    width: SIZE_IMAGE1,
    borderRadius: BORDER_RADIUS1,
  },
  image12: {
    flex: 1,
    borderTopLeftRadius: BORDER_RADIUS2,
    borderBottomLeftRadius: BORDER_RADIUS2,
  },
  image22: {
    flex: 1,
    borderTopRightRadius: BORDER_RADIUS2,
    borderBottomRightRadius: BORDER_RADIUS2,
  },
  image23: {
    flex: 1,
    borderTopRightRadius: BORDER_RADIUS2,
  },
  image33: {
    flex: 1,
    borderBottomRightRadius: BORDER_RADIUS2,
  },

  containerLikeShare: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "space-between",
    alignItems: "center",
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
